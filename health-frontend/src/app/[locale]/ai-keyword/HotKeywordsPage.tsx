"use client";

import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import {
  KeywordFeaturedActions,
  KeywordFeaturedSelectors,
} from "@/modules/ai.keyword/slice";
import React, { useEffect, useState } from "react";
import { removeVietnameseTones } from "./utils";

interface Tip {
  keyword: string;
  monthlysearch: number;
  competition_score: number;
  difficulty: string;
  overallscore: number;
}

const KeywordPage: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useAppDispatch();
  const keywords = useAppSelector(KeywordFeaturedSelectors.keywords);
  const keywordsRelated = useAppSelector(
    KeywordFeaturedSelectors.keywordsRelated
  );
  useEffect(() => {
    return () => {
      dispatch(KeywordFeaturedActions.clearKeywordFeatured());
    };
  }, [dispatch]);
  const handleSearch = async () => {
    const sanitizedKeyword: any = removeVietnameseTones(keyword);
    dispatch(
      KeywordFeaturedActions.fetchKeywordFeaturedStart(sanitizedKeyword)
    );
  };

  const renderKeywords = (keywordsList: Tip[], title: string) => {
    if (!keywordsList || keywordsList.length === 0) return null;

    return (
      <>
        <div className="">
          <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
          <div className="space-y-3">
            {keywordsList.map((tip, index) => {
              return (
                <div key={index} className="bg-slate-800 p-4 text-white transition-all duration-300 rounded-lg cursor-pointer service-card hover:shadow-lg">
                  <div className="flex flex-wrap items-center justify-between">
                    <h4 className="flex flex-grow font-semibold text-md text-primary">
                      <span className="text-gray-300">Keyword</span>
                      {tip.keyword}
                    </h4>
                    <div className="flex justify-start gap-1">
                      <p className="text-sm">
                        <span className="text-gray-300">
                          Keyword search theo thang
                        </span>
                        <span className="text-primary">
                          {tip.monthlysearch}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-300">Keyword point</span>
                        <span className="text-primary">
                          {tip.competition_score}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-300">Keyword difficu</span>
                        <span className="text-primary">{tip.difficulty}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-300">Keyword point</span>
                        <span className="text-primary">{tip.overallscore}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  const renderKeywordsRelated = (keywordsList: Tip[], title: string) => {
    if (!keywordsList || keywordsList.length === 0) return null;
    return (
      <>
        <div className="" >
          <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
          <div className="space-y-3">
            {keywordsList.map((tip, index) => {
              return (
                <div key={index}  className="bg-slate-800 p-4 text-white transition-all duration-300 rounded-lg cursor-pointer service-card hover:shadow-lg">
                  <div className="flex flex-wrap items-center justify-between">
                    <h4 className="flex flex-grow font-semibold text-md text-primary">
                      <span className="text-gray-300">Keyword</span>
                      {tip.keyword}
                    </h4>
                    <div className="flex justify-start gap-1">
                      <p className="text-sm">
                        <span className="text-gray-300">
                          Keyword search theo thang
                        </span>
                        <span className="text-primary">
                          {tip.monthlysearch}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-300">Keyword point</span>
                        <span className="text-primary">
                          {tip.competition_score}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-300">Keyword difficu</span>
                        <span className="text-primary">{tip.difficulty}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-300">Keyword point</span>
                        <span className="text-primary">{tip.overallscore}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="w-full bg-transparent ">
      <h3 className="mb-1">Từ khóa</h3>
      <div className=" text-gray-200 max-w-4xl m-auto rounded-lg w-full backdrop-blur-[10px] bg-[linear-gradient(135deg,rgba(0,255,255,0.1),rgba(255,0,255,0.1))]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="keyword-input"
                placeholder="Nhập keyword"
                value={keyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKeyword(e.target.value)
                }
                onKeyPress={handleKeyPress}
                className="block w-full p-2 text-gray-200 placeholder-gray-400 transition-all duration-200 ease-in-out bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-10">
        {renderKeywords(keywords, `Chính xác`)}
        {renderKeywords(keywordsRelated, "gan giong")}
      </div>
    </div>
  );
};

export default KeywordPage;
