import { WechatyBuilder } from 'wechaty';
import { FileBox } from 'file-box';
import { QRCode } from 'qrcode';
import { Configuration, OpenAIApi } from 'openai';

const wechaty = WechatyBuilder.build(); // get a Wechaty instance

const configuration = new Configuration({
  organization: 'org-i1ldvzXd6CSp1vK8KcWhTY9K',
  apiKey: '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',
});
const openAi = new OpenAIApi(configuration);


var regexCondition = RegExp(/draw|picture|image|画|图/)

wechaty
  .on('scan', async (qrcode, status) => {
    console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
    console.log(await QRCode.toString(qrcode, { type: "terminal", small: true }))
  })
  .on('login', (user) => console.log(`User ${user} logged in`))
  .on('message', async (message) => {
    console.log(`Message: ${message}`);
    console.log(`Message: ${message.text().substring(message.text().trim().indexOf(" ") + 1)}`);

    if ((message.type() === 7 && (await message.mentionSelf())) || message.talker()) {
      try {
        const originMessage = message.text().substring(message.text().trim().indexOf(" ") + 1)
        if (originMessage.match(regexCondition)) {
          var createImageRequest = {
            prompt: originMessage,
            size: "512x512",
            response_format: "url"
          };

          const response = await openAi.createImage(createImageRequest);
          const fileBox = FileBox.fromUrl(response.data.data[0].url)
          // const linkPayload = new UrlLink ({
          //   // description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
          //   // thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
          //   title       : 'Result',
          //   url         : response.data.data.url,
          // })
          message.say(fileBox);
        } else {
          var openAiRequest = {
            model: 'text-davinci-003',
            prompt: originMessage,
            temperature: 0,
            max_tokens: 1200,
            top_p: 1,
            n: 2,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ['#'],
          };
          const response = await openAi.createCompletion(openAiRequest);
          message.say(response.data.choices[0].text.replace('\n\n', ''));
        }
      } catch (error) {
        console.error(error);
        if (error.response.status === 429) {
          message.say('你说话太快了，请休息一下');
        } else {
          console.error(error);
          message.say('出了点问题，正在维修中');
        }
      }
    }
  });
wechaty.start();
