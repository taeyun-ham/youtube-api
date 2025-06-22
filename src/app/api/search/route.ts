// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY as string;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const viewCount = searchParams.get("viewCount") || "0";

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter q" },
      { status: 400 }
    );
  }

  // 1단계: 키워드로 videoId 검색
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      q
    )}&type=video&maxResults=10&regionCode=KR&order=viewCount&key=${API_KEY}`
  );
  const searchJson = await searchRes.json();
  const videoIds = searchJson.items
    ?.map((item: any) => item.id.videoId)
    .join(",");

  // 2단계: 상세 정보 조회
  const detailRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&regionCode=KR&id=${videoIds}&key=${API_KEY}`
  );
  const detailJson = await detailRes.json();

  const videos = detailJson.items
    ?.filter(
      (item: any) => parseInt(item.statistics.viewCount) >= parseInt(viewCount)
    )
    .map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      viewCount: parseInt(item.statistics.viewCount),
      thumbnail: item.snippet.thumbnails?.medium?.url,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      raw: item, // 👈 전체 JSON 포함
    }));

  return NextResponse.json({ videos });
}
