"use client";
import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { VirtuosoGrid, Virtuoso, GridComponents } from "react-virtuoso";
import * as _ from "lodash";
import moment from "moment";

import data from './result.json';

import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tooltip, Slider, Chip, IconButton } from "@mui/material";

import { Chart, GoogleChartWrapper, ReactGoogleChartEvent } from "react-google-charts";

import "./style.css";
const episodes = [
  "*", "1-3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"
]
const HOST = 'https://anon-tokyo.com';
const CDN = 'https://cdn.anon-tokyo.com';

const SITE_THEME_COLOR = '#3381AF';

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
        })
      } else {
        setResultList([]);
      }

    }, 200), [])


  useEffect(() => {
    debounceFetchResultList(keyword, episode);
  }, [keyword, episode]);

  //const [fullImage, setFullImage] = useState({ isVisible: false, episode: "", src: "", start: 0, end: 0 });
  const [fullImageSrc, setFullImageSrc] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [currentFrame, setCurrentFrame] = useState(-1);

  const [segmentId, setSegmentId] = useState(0);

  const [timelineEpisodeState, setTimelineEpisodeState] = useState("1-3");

  const initStartEnd: [number, number] = [-1, -1];
  const [frameStartEnd, setFrameStartEnd] = useState(initStartEnd);

  const segmentIdRef = useRef(0);

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: SITE_THEME_COLOR }}>

        <SearchResult
          resultList={resultList}
          setTimelineEpisodeState={setTimelineEpisodeState}
          setFullImageSrc={setFullImageSrc}
          setIsVisible={setIsVisible}
          //setSegment={setSegment}
          setSegmentId={setSegmentId}
          segmentIdRef={segmentIdRef}
          setFrameStartEnd={setFrameStartEnd}
          setCurrentFrame={setCurrentFrame} />
        <div style={{ position: "fixed", top: "0px" }}>
          <input style={{ position: "relative", padding: "0.5rem", opacity: "0.7", top: "20px", left: "20px" }} placeholder="輸入台詞" value={keyword} onChange={handleKeywordOnChange}></input>
          <select style={{ position: "relative", padding: "0.5rem", opacity: "0.7", top: "20px", left: "20px" }} onChange={handleEpisodeOnChange}>
            {episodes.map((e) => { return <option value={e} key={e}>{e}</option> })}
          </select>
        </div>
        {<FullImageContainer
          timelineEpisodeState={timelineEpisodeState}
          setTimelineEpisodeState={setTimelineEpisodeState}
          fullImageSrc={fullImageSrc}
          setFullImageSrc={setFullImageSrc}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          //segment={segment}
          //setSegment={setSegment}
          //segmentId={segmentId}
          setSegmentId={setSegmentId}
          segmentIdRef={segmentIdRef}
          frameStartEnd={frameStartEnd}
          setFrameStartEnd={setFrameStartEnd}
          currentFrame={currentFrame}
          setCurrentFrame={setCurrentFrame}>

        </FullImageContainer>}

      </div>
    </>
  );
}

function FullImageContainer({
  timelineEpisodeState,
  setTimelineEpisodeState,
  fullImageSrc,
  setFullImageSrc,
  isVisible,
  setIsVisible,
  //segment,
  //setSegment,
  //segmentId,
  setSegmentId,
  segmentIdRef,
  frameStartEnd,
  setFrameStartEnd,
  currentFrame, setCurrentFrame }:
  {
    timelineEpisodeState: string,
    setTimelineEpisodeState: React.Dispatch<string>,
    fullImageSrc: string,
    setFullImageSrc: React.Dispatch<string>,
    isVisible: boolean,
    setIsVisible: React.Dispatch<boolean>,
    //segment: any,
    //setSegment: React.Dispatch<any>,
    //segmentId: number,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    frameStartEnd: [number, number],
    setFrameStartEnd: React.Dispatch<[number, number]>
    currentFrame: number,
    setCurrentFrame: React.Dispatch<number>
  }) {

  //console.log("FullImageContainer :", segmentId);
  const debounceChangeCurrentFrame = useCallback(
    _.debounce((frame, episode) => {
      setFullImageSrc(`${HOST}/image?frame=${frame}&episode=${episode}`);
    }, 300),
    [])
  const handleCurrentFrameOnChange = (_: Event, value: number | number[], activeThumb: number) => {
    debounceChangeCurrentFrame(value, timelineEpisodeState);
    setCurrentFrame(value as number);
  }

  //const segment = data.result[segmentId];
  return (
    <div style={{
      position: "fixed",
      top: "0px", left: "0px",
      width: "100%", height: "100%",
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      //transform: "translate(50%, 50%)",
      background: "rgba(0, 0, 0, 0.5)",
      userSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none",
      visibility: isVisible === true ? "visible" : "hidden"
    }}>

      <div style={{
        width: "100dvw",
        height: "100dvw"
      }}>

        <img className="full-image" src={fullImageSrc} loading="lazy" />

        <CloseIcon
          onClick={function (e) {
            setFullImageSrc("");
            setIsVisible(false);
            //setSegment({is_visible: false, ...segment})
            setCurrentFrame(0);
          }}
          className="close-button"
        />
        <Slider
          sx={{
            "& .MuiSlider-thumb": {
              color: SITE_THEME_COLOR
            },
            "& .MuiSlider-track": {
              color: SITE_THEME_COLOR,
              height: 8
            },
            "& .MuiSlider-rail": {
              color: "white",
              height: 20
            },
            "& .MuiSlider-active": {
              color: SITE_THEME_COLOR
            },
            "& .MuiSlider-mark": {
              color: "black",
              height: 2,
              width: 2
            },
            "& .MuiSlider-markActive": {
              color: "white",
              height: 2,
              width: 2
            }
          }}
          onChange={handleCurrentFrameOnChange}
          valueLabelDisplay="auto"
          style={{ marginLeft: "10dvw", marginRight: "10dvw", width: "80dvw", height: "0px" }}
          value={currentFrame}
          marks
          step={1}
          min={frameStartEnd[0]}
          max={frameStartEnd[1]} />

        <Tooltip title={`${frameStartEnd[0]}~${frameStartEnd[1]} ${currentFrame}`}>
          <Chip
            style={{ marginLeft: "10dvw" }}
            color="primary"
            sx={{ "& .MuiChip-colorPrimary": { color: SITE_THEME_COLOR } }}
            label={`${currentFrame - frameStartEnd[0]}/${frameStartEnd[1] - frameStartEnd[0]}`} />

        </Tooltip>

        <Timeline
          setTimelineEpisodeState={setTimelineEpisodeState}
          setSegmentId={setSegmentId}
          setCurrentFrame={setCurrentFrame}
          setFullImageSrc={setFullImageSrc}
          setFrameStartEnd={setFrameStartEnd}
          segmentIdRef={segmentIdRef} />
      </div>


    </div>)
}

function getTimelineSlice(segmentId: number): any[] {
  const offset = 3;
  //clamp
  const start = Math.min(Math.max(segmentId - offset, 0), data.result.length);
  const end = Math.min(Math.max(segmentId + offset + 1, 0), data.result.length);
  const slice =
    data.result
      .slice(start, end);
  const textlessAndTextful: any[] = [];
  slice.forEach((e) => {
    textlessAndTextful.push(e);
    const textlessStart = e.frame_end + 1;
    const next = e.segment_id + 1;

    if (next > 0 && next < data.result.length) {
      const textlessEnd = data.result[next].frame_start - 1;
      if (textlessEnd > textlessStart) {
        textlessAndTextful.push({
          episode: e.episode,
          text: "",
          frame_start: textlessStart,
          frame_end: textlessEnd,
          segment_id: -1
        });
      }
    }
  });
  return textlessAndTextful as any[];
}
function Timeline({
  setTimelineEpisodeState,
  setFullImageSrc,
  setSegmentId,
  segmentIdRef,
  setFrameStartEnd,
  setCurrentFrame,
}:
  {
    setTimelineEpisodeState: React.Dispatch<string>
    setFullImageSrc: React.Dispatch<string>,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    setFrameStartEnd: React.Dispatch<[number, number]>,
    setCurrentFrame: React.Dispatch<number>,
  }) {
  const sg = data.result[segmentIdRef.current];
  const pos = sg.segment_id;
  const slice = getTimelineSlice(pos);
  const sliceRef = useRef(slice);
  sliceRef.current = slice;
  const colors = [
    '#264c99', '#a52a0d', '#bf7200',
    '#0c7012', '#720072', '#007294',
    '#b72153', '#4c7f00', '#8a2222',
    '#244a6f', '#723372', '#197f72',
    '#7f7f0c', '#4c2699', '#ac5600',
    '#680505', '#4b0c4d', '#256d49',
    '#3f577c', '#2c2e81', '#895619',
    '#10a017', '#8a0e62', '#d30b79',
    '#754227', '#7e930e', '#1f5969',
    '#4c6914', '#8e7b0e', '#084219',
    '#57270c'
  ]
  const currentIndex = slice.findIndex((e)=> { return sg.segment_id === e.segment_id });
  const timeline = [
    [
      { type: "string", id: "sentence" },
      { type: "string", id: "text" },
      { type: "string", id: "style", role: "style" },
      { type: "string", role: "tooltip" },
      { type: "number", id: "Start" },
      { type: "number", id: "End" }
    ],
    ...slice.map((e, i) => [
      "台詞",
      (sg.segment_id === e.segment_id ? "> " : "") + e.text,
      colors[e.frame_start % colors.length],
      `<div style="padding: 4px">${e.text}</br>${e.frame_start}~${e.frame_end}</br>${formatFrameStamp(e.frame_start)}~${formatFrameStamp(e.frame_end)}</div>`,
      (e.frame_start / 23.98 * 1000),
      (e.frame_end / 23.98 * 1000)
    ]),
  ];

  const setNewSegment = (seg: any) => {
    const newSegmentId = seg.segment_id;
    if (newSegmentId >= 0 && newSegmentId < data.result.length) {
      sliceRef.current = getTimelineSlice(newSegmentId);
      setSegmentId(newSegmentId);
      segmentIdRef.current = newSegmentId;
    }
    setTimelineEpisodeState(seg.episode);
    setFullImageSrc(`${HOST}/image?frame=${seg.frame_start}&episode=${seg.episode}`);
    setFrameStartEnd([seg.frame_start, seg.frame_end]);
    setCurrentFrame(seg.frame_start);
  }
  //console.log(slice);
  //console.log(segmentIdRef.current);
  const selectHandler = function ({ chartWrapper, google }: { chartWrapper: GoogleChartWrapper, google: any }) {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection()[0]['row'];
    const seg = sliceRef.current[selection];
    setNewSegment(seg);
  }

  const selectEvent: ReactGoogleChartEvent =
  {
    eventName: "select",
    callback: selectHandler
  }

  return (
    <div style={{ background: "white" }}>

      <Chart
        style={{ marginTop: "8px" }}
        chartType="Timeline"
        data={timeline}
        options={{
          timeline: {
            groupByRowLabel: true,
          },
          tooltip: {
            isHtml: true,
          },
          avoidOverlappingGridLines: false
        }}
        width="100dvw"
        height="100px"
        chartEvents={[selectEvent]}
      />
      <div style={{ position: "fixed", bottom: "5dvh", width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
        <IconButton
          style={{ background: SITE_THEME_COLOR, color: "white" }}
          onClick={() => {
            const next = Math.min(Math.max(currentIndex - 2, 0), sliceRef.current.length);
            setNewSegment(sliceRef.current[next]);
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            const next = Math.min(Math.max(currentIndex + 2, 0), sliceRef.current.length);
            setNewSegment(sliceRef.current[next]);
          }}
          style={{ background: SITE_THEME_COLOR, color: "white", marginLeft: "32px" }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  );
}
const gridComponents = {
  List: forwardRef(({ style, children, ...props }: { style: any, children: any }, ref: any) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children }: { children: any }) => (
    <div className="result-item">
      {children}
    </div>
  )
}

function formatFrameStamp(frame: number): string {
  return moment.utc(frame / 23.98 * 1000).format("HH:mm:ss.SSS");
}
//rgb(51, 129, 175)
const ItemWrapper = ({
  index,
  result,
  setTimelineEpisodeState,
  setFullImageSrc,
  setIsVisible,
  //setSegment,
  setSegmentId,
  segmentIdRef,
  setFrameStartEnd,
  setCurrentFrame }:
  {
    index: number,
    result: any,
    setTimelineEpisodeState: React.Dispatch<string>,
    setFullImageSrc: React.Dispatch<string>,
    setIsVisible: React.Dispatch<boolean>,
    //setSegment: React.Dispatch<any>,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    setFrameStartEnd: React.Dispatch<[number, number]>
    setCurrentFrame: React.Dispatch<number>
  }) => (
  <div style={{ width: "inherit" }}>

    <div style={{
      position: "absolute",
      display: "flex",
      flexWrap: "nowrap",
      width: "inherit",
      maxHeight: "calc(16px + 1.6rem)",
      textOverflow: "ellipsis",
      background: "rgba(0, 0, 0, 0.3)"
    }}>
      <span style={{ padding: "4px", fontSize: "0.8rem", color: "white", maxLines: "1", textOverflow: "ellipsis" }}>{`${index}`}</span>
      <span style={{ padding: "4px", fontSize: "0.8rem", color: SITE_THEME_COLOR, maxLines: "1", textOverflow: "ellipsis" }}>{`${result.episode}`}</span>
      <span style={{ padding: "4px", fontSize: "0.8rem", color: "red", maxLines: "1", textOverflow: "ellipsis" }}>{`${result.frame_start} ~ ${result.frame_end}`}</span>
      <span style={{ padding: "4px", fontSize: "0.8rem", color: "white", maxLines: "1", textOverflow: "ellipsis" }}>{`${formatFrameStamp(result.frame_start)}`}</span>
    </div>

    <Tooltip title={<h1 style={{ fontSize: "18px" }}>{result.text}</h1>} arrow>
      <img className="result-item"
        onClick={function (e) {
          //initial set
          setTimelineEpisodeState(result.episode);
          setFullImageSrc(`${HOST}/image?frame=${result.frame_start}&episode=${result.episode}`);
          setIsVisible(true);
          setSegmentId(result.segment_id);
          setFrameStartEnd([result.frame_start, result.frame_end]);
          setCurrentFrame(result.frame_start);
          segmentIdRef.current = result.segment_id;
        }}
        loading="lazy"
        src={`${CDN}/thumb/thumb/${result.episode}__${result.frame_start}.jpg`} />
    </Tooltip>

  </div>
);
/*
<div style={{ padding: "4px", background: "rgba(0, 0, 0, 0.3)", fontWeight: "900", color: "white", fontSize: "0.7rem" }}>{`${index}`}</div>
      <div style={{ padding: "4px", background: "rgba(0, 0, 0, 0.3)", fontSize: "0.7rem", color: "rgb(51, 129, 175)" }}>{`${result.episode}`}</div>
      <div style={{ padding: "4px", background: "rgba(0, 0, 0, 0.3)", fontSize: "0.7rem", color: "red" }}>{`${result.frame_start} ~ ${result.frame_end}`}</div>
      <div style={{ maxWidth:"25%", padding: "4px", background: "rgba(1.0, 0, 0, 0.3)", fontSize: "0.7rem", color: "white", textOverflow: "ellipsis" }}>{`${formatFrameStamp(result.frame_start)}`}</div>
 */
/*
<Tooltip title={<h1 style={{ fontSize: "18px" }}>{result.text}</h1>} arrow>
      <div style={{
        flex: 1,
        textAlign: "center",
        fontWeight: "900",
        fontSize: "16px",
        alignContent: "center",
        border: "1px dashed black",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        {`${result.text}`}
      </div>
    </Tooltip>
*/

function SearchResult({
  resultList,
  setTimelineEpisodeState,
  setFullImageSrc,
  setIsVisible,
  //setSegment,
  setSegmentId,
  segmentIdRef,
  setFrameStartEnd,
  setCurrentFrame }:
  {
    resultList: any[],
    setTimelineEpisodeState: React.Dispatch<string>,
    setFullImageSrc: React.Dispatch<string>,
    setIsVisible: React.Dispatch<boolean>,
    //setSegment: React.Dispatch<any>,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    setFrameStartEnd: React.Dispatch<[number, number]>
    setCurrentFrame: React.Dispatch<number>
  }) {
  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        style={{ height: "100%" }}
        totalCount={resultList.length}
        data={resultList}
        components={gridComponents as GridComponents}
        itemContent={(index, r) =>
        (<ItemWrapper
          index={index}
          result={r}
          setTimelineEpisodeState={setTimelineEpisodeState}
          setFullImageSrc={setFullImageSrc}
          setIsVisible={setIsVisible}
          //setSegment={setSegment}
          setSegmentId={setSegmentId}
          segmentIdRef={segmentIdRef}
          setFrameStartEnd={setFrameStartEnd}
          setCurrentFrame={setCurrentFrame}>

        </ItemWrapper>)}
      />

      <style>{`html, body, #root { margin: 0; padding: 0 }`}</style>

    </>
  );
}


/*function SearchResult0({ keyword, episode, resultList }: { keyword: string, episode: string, resultList: any[] }) {
  //const [resultList, setResultList] = useState([])
  return (
    <Virtuoso className="!h-[100%]" data={resultList} itemContent={(index, result) => (<Result result={result} index={index} />)} />
  );
}*/

function Result({ result, index }: { result: any, index: number }) {
  return (<div className="result">{`${result.text}`}</div>)
}

function match(item: any, keyword: string, episode: string) {
  let ep: boolean = episode === '*' ? true : item.episode === episode;
  let text = item.text as string;
  let text_sim = item.text_sim as string;
  let textMatch = text.toLowerCase().includes(keyword.toLowerCase());
  let textSimMatch = text_sim.toLowerCase().includes(keyword.toLowerCase());
  return (ep && (textMatch || textSimMatch)) === true;
}

/*async function getSearchResultList0(keyword: string, episode: string) {
  return await fetch(`${HOST}/api/search?keyword=${keyword}&episode=${episode}`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        return Promise.resolve({ result: [] })
      }

    });
}*/

async function getSearchResultList(keyword: string, episode: string) {
  return await Promise.resolve(data.result as any[]).then(function (r) {
    return Promise.resolve(r.filter((item: any) => match(item, keyword, episode)));
  });
}