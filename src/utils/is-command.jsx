import axios from 'axios';
const openAI_Key = import.meta.env.VITE_OPENAI_KEY;

let user = {
  name: import.meta.env.VITE_USER_NAME,
  city: import.meta.env.VITE_USER_CITY,
  state: import.meta.env.VITE_USER_STATE,
  street_address: import.meta.env.VITE_USER_STREET_ADDRESS,
  area_code: import.meta.env.VITE_USER_AREA_CODE,
};

let RecognizedSpeech = ``;

const promptIsCommand = `
    Ava is a virtual assistant ai that can do tasks based on voice commands.

  Figure out if the following recognized speech is a command for Ava or not. If it is a command for ava then figure out what the command is and then say the command. Otherwise return "no command"

  Ava can do the following commands:

      list command
      search command
      fun command

  Recognized Speech: ${recognizedSpeech}

  Structure response like this and do not add extra text:
  command: <insert command>
  `

const isCommand = async (string) => {
  try {
    const url = "https://api.openai.com/v1/engines/text-davinci-003/completions";
    const headers = {
      Authorization: `Bearer ${openAI_Key}`,
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/json",
    };

    const data = {
      prompt: prompt,
      max_tokens: 256,
    };
    console.log(prompt);

    const response = await axios.post(url, data, { headers });
    const gptResponse = response.data.choices[0].text;
    console.log(gptResponse);
    return gptResponse;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
  }
};

export default AskAI;