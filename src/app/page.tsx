"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as _ from "lodash";

import data from "./result.json";
import { episodes, SITE_THEME_COLOR, HINT_LINK } from "./config";
import { Chip } from "@mui/material";

import SearchResult from "@/app/components/SearchResult";
import FullImageContainer from "@/app/components/image-container/FullImageContainer";

import "./style.css";
/* const episodes = [
  "*", "1-3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"
]
const HOST = 'https://anon-tokyo.com';
const CDN = 'https://cdn.anon-tokyo.com';

const SITE_THEME_COLOR = '#3381AF';
const THUMB_PATH = "thumb" */

//const API = 'https://api.anon-tokyo.com'

export default function Home() {
  //const [segment, setSegment] = useState({ episode: "", frame_current: -1, frame_start: -1, frame_end: -1, segment_id: -1, is_visible: false});

  const [keyword, setKeyword] = useState("");
  const handleKeywordOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setKeyword(e.currentTarget.value);
  };
  const [resultList, setResultList] = useState<any[]>([]);

  const [episode, setEpisode] = useState("*");
  const handleEpisodeOnChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setEpisode(e.currentTarget.value);
    //setSegment({ ...segment, episode: episode })
  };

  const debounceFetchResultList = useCallback(
    _.debounce((keyword: string, episode: string) => {
      if (keyword.length !== 0) {
        getSearchResultList(keyword, episode).then((r) => {
          //console.log(keyword);
          //console.log(r);
          setResultList(r);
        });
      } else {
        setResultList([]);
      }
    }, 200),
    [],
  );

  useEffect(() => {
    debounceFetchResultList(keyword, episode);
  }, [keyword, episode]);

  //const [fullImage, setFullImage] = useState({ isVisible: false, episode: "", src: "", start: 0, end: 0 });
  const [fullImageSrc, setFullImageSrc] = useState("");
  const [startImageSrc, setStartImageSrc] = useState("");
  const [endImageSrc, setEndImageSrc] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isGifMode, setIsGifMode] = useState(false);

  const [currentFrame, setCurrentFrame] = useState(-1);

  const [segmentId, setSegmentId] = useState(0);

  const [timelineEpisodeState, setTimelineEpisodeState] = useState("1-3");

  const initStartEnd: [number, number] = [-1, -1];
  const [frameRangeStartEnd, setFrameRangeStartEnd] = useState(initStartEnd);

  const [gifRangeStartEnd, setGifRangeStartEnd] = useState([-1, -1] as [
    number,
    number,
  ]);

  const segmentIdRef = useRef(0);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: SITE_THEME_COLOR,
        }}
      >
        <SearchResult
          resultList={resultList}
          setTimelineEpisodeState={setTimelineEpisodeState}
          setFullImageSrc={setFullImageSrc}
          setIsVisible={setIsVisible}
          //setSegment={setSegment}
          setSegmentId={setSegmentId}
          segmentIdRef={segmentIdRef}
          setFrameRangeStartEnd={setFrameRangeStartEnd}
          setCurrentFrame={setCurrentFrame}
        />
        <div style={{ position: "fixed", top: "20px", left: "20px" }}>
          <input
            style={{ position: "relative", padding: "0.5rem", opacity: "0.7" }}
            placeholder="輸入台詞"
            value={keyword}
            onChange={handleKeywordOnChange}
          ></input>
          <select
            style={{ position: "relative", padding: "0.5rem", opacity: "0.7" }}
            onChange={handleEpisodeOnChange}
          >
            {episodes.map((e) => {
              return (
                <option value={e} key={e}>
                  {e}
                </option>
              );
            })}
          </select>
        </div>
        <Chip
          style={{ position: "absolute", top: "20px", right: "20px" }}
          sx={{ backgroundColor: "white", opacity: "0.7" }}
          label={
            <a href={HINT_LINK} target="_blank">
              {"說明"}
            </a>
          }
        />

        {
          <FullImageContainer
            timelineEpisodeState={timelineEpisodeState}
            setTimelineEpisodeState={setTimelineEpisodeState}
            fullImageSrc={fullImageSrc}
            setFullImageSrc={setFullImageSrc}
            startImageSrc={startImageSrc}
            setGifStartImageSrc={setStartImageSrc}
            endImageSrc={endImageSrc}
            setGifEndImageSrc={setEndImageSrc}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            isGifMode={isGifMode}
            setIsGifMode={setIsGifMode}
            //segment={segment}
            //setSegment={setSegment}
            //segmentId={segmentId}
            setSegmentId={setSegmentId}
            segmentIdRef={segmentIdRef}
            frameRangeStartEnd={frameRangeStartEnd}
            setFrameRangeStartEnd={setFrameRangeStartEnd}
            gifRangeStartEnd={gifRangeStartEnd}
            setGifRangeStartEnd={setGifRangeStartEnd}
            currentFrame={currentFrame}
            setCurrentFrame={setCurrentFrame}
          ></FullImageContainer>
        }
      </div>
    </>
  );
}

function match(item: any, keyword: string, episode: string) {
  let ep: boolean = episode === "*" ? true : item.episode === episode;
  let text = item.text as string;
  let text_sim = item.text_sim as string;
  let textMatch = text.toLowerCase().includes(keyword.toLowerCase());
  let textSimMatch = text_sim.toLowerCase().includes(keyword.toLowerCase());
  return (ep && (textMatch || textSimMatch)) === true;
}

async function getSearchResultList(keyword: string, episode: string) {
  return await Promise.resolve(data.result as any[]).then(function (r) {
    return Promise.resolve(
      r.filter((item: any) => match(item, keyword, episode)),
    );
  });
}
