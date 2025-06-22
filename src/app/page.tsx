"use client";

import { useState } from "react";

type Video = {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  thumbnail: string;
  url: string;
};

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [viewCount, setViewCount] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const searchVideos = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(keyword)}&viewCount=${viewCount}`
    );
    const data = await res.json();
    setVideos(data.videos);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">유튜브 10만+ 조회 영상 검색</h1>
      키워드 :{" "}
      <input
        className="border px-3 py-2 w-full mb-4"
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      조회수 :{" "}
      <input
        className="border px-3 py-2 w-full mb-4"
        type="text"
        value={viewCount}
        onChange={(e) => setViewCount(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={searchVideos}
      >
        검색
      </button>
      {loading && <p className="mt-4">로딩 중...</p>}
      <ul className="mt-6 space-y-4">
        {videos.map((v) => (
          <li key={v.id} className="border p-3 rounded grid grid-cols-2 gap-4">
            {/* 좌측: 썸네일과 정보 */}
            <div>
              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-lg"
              >
                {v.title}
              </a>
              <p className="text-sm text-gray-600">{v.description}</p>
              <p className="text-sm text-green-600">
                조회수: {v.viewCount.toLocaleString()}
              </p>
              <img src={v.thumbnail} alt={v.title} className="mt-2 w-48" />
            </div>

            {/* 우측: JSON 원본 정보 */}
            <pre className="text-xs bg-gray-100 p-2 overflow-auto max-h-64 text-black">
              {JSON.stringify(v.raw, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
