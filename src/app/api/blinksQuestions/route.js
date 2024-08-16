import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
  } from "@solana/actions";
  import { getDB } from '../../lib/db.js';
  import {PublicKey} from "@solana/web3.js"
  import fs from 'fs/promises';
  import path from 'path';
  import {  Op } from 'sequelize';

  import { createCanvas, loadImage, registerFont } from 'canvas';
  const ATTEMPTS_FILE = path.join(process.cwd(), 'data', 'attempts.json');



  export const GET = async (req) => {
    try {

        const currentTime = new Date();
        const requestUrl = new URL(req.url);

        const db = await getDB();
        let questions = await db.models.Question.findOne({
          where: {
            activeUntil: { [Op.gt]: currentTime }
          },
          order: [['activeUntil', 'DESC']]
        });


        if (!questions) {
          questions = await db.models.Question.findOne({
            where: { answered: false },
            order: [['createdAt', 'ASC']]
          });
    
          if (questions) {
            // Set the new question as active for the next 24 hours
            questions.activeUntil = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
            await questions.save();
          }
        }


        const users = await db.models.User.findAll({
            order: [['points', 'DESC']],
            limit: 3
        });


        let usersAsString 
        if(users){
          usersAsString = users.map((user, index) => {
            // Truncate the wallet address to first 4 and last 4 characters
            const shortWallet = `${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`;
            return `\n#${index + 1}🔥 ${shortWallet}; points ${user.points}pts`;
          }).join(' | ');
        }
        
        if (!questions) {

          const payload = {
            title: `Solana daily quiz (No quiz available at the moment)`,
            icon: new URL("/DailyQuiiz.jpg", requestUrl.origin).toString(),
            description: `You have only one attempt for a new question.`,
          };  
      
          return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
          });
      
        }

  
        console.log("questions")
        console.log(questions)
        console.log("questions")

        const actionsArray =/*JSON.parse(*/questions.dataValues.options/*)*/.map(option => ({
            label: option,
            href: `/api/blinksQuestions?answerId=${questions.dataValues.answer}&questionId=${questions.dataValues.id}&answer=${option}`,
        }));

       

        const imageBuffer = await generateDynamicImage(questions.dataValues.question, requestUrl);

     


        const payload = {   
            title: `Solana daily quiz (${questions.dataValues.answered ? 'ANSWERED':'UN-ANSWERED'})`,
            icon: `data:image/png;base64,${imageBuffer.toString('base64')}`,
            description: `You have only one attempt for a new question.\n ${users.length>0?'Rank Top 3;':''} ${usersAsString}`,
            links: {
              actions: actionsArray,
            },
          };  
      
          return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
          });

    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return new Response(message, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
  };

  export const OPTIONS = GET;


  export const POST = async (req) => {
    try {
      const requestUrl = new URL(req.url);
      const { answerId, questionId, answer } = validatedQueryParams(requestUrl);
      const body= await req.json();
      const publicAddress = new PublicKey(body.account);

  
      const db = await getDB();
      const question = await db.models.Question.findOne({
        where: { id: questionId },
      });

      if (!question) {
        return new Response(JSON.stringify({ message: "Question not found" }), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      if (question.answered) {
        return new Response(JSON.stringify({ message: "This question has already been answered" }), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      await attemptManager.loadAttempts();

      if (attemptManager.canAttempt(publicAddress, questionId)) {

        const recorded = await attemptManager.recordAttempt(publicAddress, questionId, answer);

        if (recorded) {

          const isCorrect = answer ===  JSON.parse(question.options)[answerId];
          console.log( isCorrect)
          console.log( answer)
          console.log( JSON.parse(question.options)[answerId])


          const [user, created] = await db.models.User.findOrCreate({
            where: { wallet: publicAddress.toString() },
            defaults: { points: 0 }
          });

          
          if (isCorrect) {
            // If the answer is correct, add 2 points
            await user.increment('points', { by: 2 });
               // Mark the question as answered
            await question.update({ answered: true });

            return new Response(JSON.stringify({ message: "Attempt recorded successfully." }), {
                status: 200,
                headers: ACTIONS_CORS_HEADERS
            });
          }else{
            return new Response(JSON.stringify({ message: "Wrong answer 🥺 try again tommorrow"}), {
              status: 400,
              headers: ACTIONS_CORS_HEADERS,
            });
          }
          
       


      } else {
          return new Response(JSON.stringify({ message: "Failed to record attempt." }), {
              status: 500,
              headers: ACTIONS_CORS_HEADERS
          });
      }

      }
      else{
        return new Response(JSON.stringify({ message: "You've already attempted this question ."}), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });

      }


    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return new Response(message, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
  };




  

  function validatedQueryParams(requestUrl) {
    let answerId;
    let questionId;
    let answer;

  
    try {
      if (requestUrl.searchParams.get("answerId")) {
        answerId = parseFloat(requestUrl.searchParams.get("answerId"));
      }
  
    } catch (err) {
      console.log(err)
      throw "Invalid input query parameter: amount";
    }
  
    
    try {
      if (requestUrl.searchParams.get("questionId")) {
        questionId = String(requestUrl.searchParams.get("questionId"));
      }
      
    } catch (err) {
      console.log(err)
      throw "Invalid input query parameter: amount";
    }
  
      
    try {
      if (requestUrl.searchParams.get("answer")) {
        answer = String(requestUrl.searchParams.get("answer"));
      }
      
    } catch (err) {
      console.log(err)
      throw "Invalid package";
    }
  
  
  
    return {
        answerId,
        questionId,
        answer
    };
  }




  async function generateDynamicImage(text, requestUrl) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
  

    const backgroundImage = await loadImage(new URL("/DailyQuiiz.jpg", requestUrl.origin).toString());
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    

    // Set the font and text properties         
    ctx.font = '35px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

  // Draw the text in the center of the canvas
  const maxWidth = 700; // Maximum width for text wrapping
  const lineHeight = 40;
  wrapText(ctx, text, canvas.width / 2, canvas.height / 2, maxWidth, lineHeight);

  
    return canvas.toBuffer('image/png');
  }


  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
  
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  class AttemptManager {
    constructor(filename) {
        this.filename = path.join(process.cwd(), filename);
        this.attempts = {};
    }    
    
    async loadAttempts() {

      console.log(this.filename)
        try {
            await fs.access(this.filename);
            const data = await fs.readFile(this.filename, 'utf8');
            this.attempts = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.saveAttempts();
                console.log('Attempts file created.');
            } else {
                console.error('Error loading attempts:', error);
            }
        }
    }

    async saveAttempts() {
        await fs.writeFile(this.filename, JSON.stringify(this.attempts, null, 2));
    }

    canAttempt(publicAddress, questionId) {
        if (!this.attempts[questionId]) {
            this.attempts[questionId] = {};
        }
        return !this.attempts[questionId][publicAddress];
    }

    async recordAttempt(publicAddress, questionId, answer) {
        if (this.canAttempt(publicAddress, questionId)) {
            this.attempts[questionId][publicAddress] = {
                timestamp: new Date().toISOString(),
                answer
            };
            await this.saveAttempts();
            return true;
        }
        return false;
    }
}

const attemptManager = new AttemptManager('attempts.json');
