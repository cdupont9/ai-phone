const express = require("express");

const bodyParser = require("body-parser");

const twilio = require("twilio");

const axios = require("axios");



const app = express();

app.use(bodyParser.urlencoded({ extended: false }));



app.post("/voice", (req, res) => {

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say("Hello! This is your AI prototype. Please speak after the beep.");

  twiml.gather({

    input: "speech",

    action: "/process",

    speechTimeout: "auto"

  });

  res.type("text/xml");

  res.send(twiml.toString());

});



app.post("/process", async (req, res) => {

  const userSpeech = req.body.SpeechResult || "Hello";

  const aiResponse = await getAIResponse(userSpeech);



  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(aiResponse);

  twiml.gather({

    input: "speech",

    action: "/process",

    speechTimeout: "auto"

  });



  res.type("text/xml");

  res.send(twiml.toString());

});



async function getAIResponse(text) {

  const response = await axios.post(

    "https://api.openai.com/v1/chat/completions",

    {

      model: "gpt-4.1-mini",

      messages: [

        { role: "system", content: "You are a friendly phone assistant." },

        { role: "user", content: text }

      ]

    },

    {

      headers: {

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`

      }

    }

  );

  return response.data.choices[0].message.content;

}



app.listen(3000, () => {

  console.log("Server running on port 3000");

});
