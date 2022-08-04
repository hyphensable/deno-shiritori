import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
let WordList = ["あいさつ", "あいず","あき", "あさ", "あさり", "あしか", "あだな", "あめ", "あり", "あるみほいる", "あんず"];
let previousWord = WordList[ Math.floor( Math.random() * WordList.length ) ];
const WordHistory = [];

console.log("Listening on http://localhost:8000");

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }
  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;
    if (nextWord.match(/^[ぁ-んー　]*$/)) { ; } else {
      return new Response("ひらがな以外は使えません。", { status: 400 });
    }
    if ( nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
      return new Response("前の単語に続いていません。", { status: 400 });
    }
    if ( nextWord.charAt(nextWord.length - 1) == "ん") {
      return new Response("ゲーム終了！あなたの負けです。", { status: 400 });
    }
    if (WordHistory.includes(nextWord)) {
      return new Response("その単語はもう使ってあります。", { status: 400 });
    }
    WordHistory.push(previousWord);
    previousWord = nextWord;


    return new Response(previousWord);
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});