const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};


  export const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with Al image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"scenes\": [\n    {\n      \"imagePrompt\": \"A bustling 18th-century London street scene, cobblestones glistening with rain, horse-drawn carriages, and people in period clothing hurrying past a dimly lit apothecary shop. Focus on the detailed textures and realistic lighting, with a slightly melancholic atmosphere.\",\n      \"contentText\": \"In 1784, a London apothecary, John Smith, stumbled upon a strange formula while mixing compounds. Little did he know, he'd inadvertently created a primitive form of cough syrup.\"\n    },\n      {\n       \"imagePrompt\":\"Inside John Smith's cluttered apothecary shop, glass bottles line the shelves, strange herbs hang drying from the ceiling. John, with his spectacles on his nose, meticulously pours a dark liquid into a small glass vial. The lighting is soft and warm, focusing on the details of the apothecary.\",\n      \"contentText\":\"This peculiar concoction, a mix of honey, herbs, and a secret ingredient, wasn’t intended to be medicine. He’d been trying to make ink, of all things.\"\n    },\n    {\n      \"imagePrompt\": \"A close-up shot of the small glass vial filled with the dark, syrupy liquid, labels handwritten in old English. Light catches the surface, highlighting the texture and viscosity.  Use realistic texture and detail to show old paper and handmade label.\",\n      \"contentText\": \"But one cold, damp evening, John, battling a nasty cough, decided to try his accidental formula. To his surprise, he felt instant relief.\"\n    },\n     {\n      \"imagePrompt\": \"A wide angle view of John Smith's apothecary shop. A long line of people form outside the entrance, bundled in winter clothes. People are looking and gesturing to the apothecary windows. The weather appears cold, with a slight mist in the air.\",\n      \"contentText\": \"Word spread like wildfire. Soon, John's shop was flooded with Londoners seeking his 'miracle cure'. He became an overnight sensation!\"\n    },\n     {\n      \"imagePrompt\": \"John Smith standing behind his counter, looking slightly overwhelmed but pleased. He hands a small vial to a customer, the counter is piled with stacks of coin money and empty vials, all captured in a realistic 18th-century setting. Highlight the details of his clothing and the shop around him.\",\n       \"contentText\": \"John, the accidental inventor, went from struggling apothecary to cough syrup mogul, all thanks to a failed ink recipe! \"\n    }\n  ]\n}\n```\n"},
        ],
      },
    ],
  });

