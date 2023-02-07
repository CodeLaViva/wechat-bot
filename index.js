import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  // organization: "org-i1ldvzXd6CSp1vK8KcWhTY9K",
  apiKey: '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',
});
const openAi = new OpenAIApi(configuration);
// var a = {
//   model: 'text-davinci-003',
//   prompt: 'how to create a BOM for software',
//   temperature: 0,
//   max_tokens: 1200,
//   top_p: 1,
//   n: 2,
//   frequency_penalty: 0.0,
//   presence_penalty: 0.0,
//   stop: ['#'],
// };
// const response = await openAi.createCompletion(a);

var b = {
  prompt: '黑猫警长',
  size: "256x256",
  response_format: "url"
  // response_format: "b64_json"
};

var response = await openAi.createImage(b);

console.log(response.data.data[0].url);

