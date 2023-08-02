import axios from 'axios';
const openAI_Key = import.meta.env.VITE_OPENAI_KEY;

let user = {
  name: import.meta.env.VITE_USER_NAME,
  city: import.meta.env.VITE_USER_CITY,
  state: import.meta.env.VITE_USER_STATE,
  street_address: import.meta.env.VITE_USER_STREET_ADDRESS,
  area_code: import.meta.env.VITE_USER_AREA_CODE,
};

const User = {
  user: `Your user is ${user.name} and they live in ${user.city}, ${user.state}. Their street address is ${user.street_address} and their area code is ${user.area_code}.`,
};

const AskAI = async (prompt) => {
  try {
    const url = "https://api.openai.com/v1/engines/text-davinci-003/completions";
    const headers = {
      Authorization: `Bearer ${openAI_Key}`,
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/json",
    };

    const data = {
      prompt: user.user + prompt,
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