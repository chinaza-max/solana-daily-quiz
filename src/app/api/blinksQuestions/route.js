import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
  } from "@solana/actions";
  import { getDB } from '../../lib/db.js';
  import {PublicKey} from "@solana/web3.js"

  import { createCanvas, loadImage, registerFont } from 'canvas';
  const ATTEMPTS_FILE = path.join(process.cwd(), 'data', 'attempts.json');



  export const GET = async (req) => {
    try {

        const requestUrl = new URL(req.url);


        const db = await getDB();
        const questions = await db.models.Question.findOne({
            where: { answered: false },
        });

        const users = await db.models.User.findAll({
            order: [['points', 'DESC']],
            limit: 3
        });

        if (!questions) {
            return new Response(JSON.stringify({ message: "No unanswered questions found" }), {
                status: 400,
                headers: ACTIONS_CORS_HEADERS,
            });
        }

        const actionsArray =JSON.parse(questions.dataValues.options).map(option => ({
            label: option,
            href: `/api/blinksQuestions?answerId=${questions.dataValues.answer}&questionId=${questions.dataValues.id}&answer=${option}`,
        }));

        const imageBuffer = await generateDynamicImage(questions.dataValues.question, requestUrl);


        const payload = {
            title: `Solana daily quiz`,
            icon: `data:image/png;base64,${imageBuffer.toString('base64')}`,
            description: 'sssssss',
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
      const account = new PublicKey(body.account);

  

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


      await writeJsonFile(ATTEMPTS_FILE, attempts);


      let questions= [];
  
      const matchingQuestion = questions.find(
        question => question.actionId === uniqueAction && question.id === questionId
      );
  
      if (!matchingQuestion) {
        return new Response(JSON.stringify({ message: "Question not found" }), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }
  
      // Check if the question has already been answered
      if (body.answers.includes(matchingQuestion.id)) {
        return new Response(JSON.stringify({ message: "Question has already been answered" }), {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }
  
      // Process the selected option and update the user's progress
      // ...
  
      const payload = await createPostResponse({
        fields: {
          message: "Your quiz answer has been submitted successfully!",
        },
      });
  
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


  async function writeJsonFile(filename, data) {
    await fs.writeFile(path.join(process.cwd(), filename), JSON.stringify(data, null, 2));
  }


async function readJsonFile(filename) {
    try {
      const data = await fs.readFile(path.join(process.cwd(), filename), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {}; // Return an empty object if file doesn't exist
      }
      throw error;
    }
  }
  

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
  

    console.log(requestUrl.origin)

    const backgroundImage = await loadImage(new URL("/download.png", requestUrl.origin).toString());
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  
    // Set the font and text properties
    ctx.font = '35px Arial';
    ctx.fillStyle = 'black';
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


  // GET THE QUESTION 
  // CHECK IF THE QUESTION HAS BEEN ANSWERED
  // IF YES DECLINE
  // IF NO 
  // CHECK THE ANSWER IS CORRECT
  // IF YES SCORE HIM 
  // IF NO TEMPORARY STORE HIM IN A JSON USING QUESTION ID SO THAT HE WONT TRY AGAIN ONE TRIAL PER PERSON