"use client";
import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { VirtuosoGrid, Virtuoso, GridComponents } from "react-virtuoso";
import * as _ from "lodash";
import moment from "moment";

import data from './result.json';
import { episodes, HOST, CDN, SITE_THEME_COLOR, THUMB_PATH, HINT_LINK } from "./config";
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tooltip, Slider, Chip, IconButton, Switch, FormControlLabel, Button, Input, useMediaQuery, useTheme } from "@mui/material";

import { Chart, GoogleChartWrapper, ReactGoogleChartEvent } from "react-google-charts";

import "./style.css";
import { ArrowDownward, FastForward, FastRewind } from "@mui/icons-material";
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
  const [startImageSrc, setStartImageSrc] = useState("");
  const [endImageSrc, setEndImageSrc] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isGifMode, setIsGifMode] = useState(false);

  const [currentFrame, setCurrentFrame] = useState(-1);

  const [segmentId, setSegmentId] = useState(0);

  const [timelineEpisodeState, setTimelineEpisodeState] = useState("1-3");

  const initStartEnd: [number, number] = [-1, -1];
  const [frameRangeStartEnd, setFrameRangeStartEnd] = useState(initStartEnd);

  const [gifRangeStartEnd, setGifRangeStartEnd] = useState([-1, -1] as [number, number]);

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
          setFrameRangeStartEnd={setFrameRangeStartEnd}
          setCurrentFrame={setCurrentFrame} />
        <div style={{ position: "fixed", top: "20px", left: "20px" }}>
          <input style={{ position: "relative", padding: "0.5rem", opacity: "0.7" }} placeholder="輸入台詞" value={keyword} onChange={handleKeywordOnChange}></input>
          <select style={{ position: "relative", padding: "0.5rem", opacity: "0.7" }} onChange={handleEpisodeOnChange}>
            {episodes.map((e) => { return <option value={e} key={e}>{e}</option> })}
          </select>
        </div>
        <Chip
          style={{ position: "absolute", top: "20px", right: "20px" }}
          sx={{backgroundColor: "white", opacity: "0.7"}}
          label={<a href={HINT_LINK} target="_blank">{"說明"}</a>} />

        {<FullImageContainer
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
  startImageSrc,
  setGifStartImageSrc: setGifStartImageSrc,
  endImageSrc,
  setGifEndImageSrc: setGifEndImageSrc,
  isVisible,
  setIsVisible,
  isGifMode,
  setIsGifMode,
  //segment,
  //setSegment,
  //segmentId,
  setSegmentId,
  segmentIdRef,
  frameRangeStartEnd,
  setFrameRangeStartEnd,
  gifRangeStartEnd,
  setGifRangeStartEnd,
  currentFrame,
  setCurrentFrame }:
  {
    timelineEpisodeState: string,
    setTimelineEpisodeState: React.Dispatch<string>,
    fullImageSrc: string,
    setFullImageSrc: React.Dispatch<string>,
    startImageSrc: string,
    setGifStartImageSrc: React.Dispatch<string>,
    endImageSrc: string,
    setGifEndImageSrc: React.Dispatch<string>,
    isVisible: boolean,
    setIsVisible: React.Dispatch<boolean>,
    isGifMode: boolean,
    setIsGifMode: React.Dispatch<boolean>,
    //segment: any,
    //setSegment: React.Dispatch<any>,
    //segmentId: number,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    frameRangeStartEnd: [number, number],
    setFrameRangeStartEnd: React.Dispatch<[number, number]>,
    gifRangeStartEnd: [number, number],
    setGifRangeStartEnd: React.Dispatch<[number, number]>,
    currentFrame: number,
    setCurrentFrame: React.Dispatch<number>
  }) {

  const theme = useTheme();
  const large: boolean = useMediaQuery(theme.breakpoints.up("sm"));

  const debounceChangeCurrentFrame = useCallback(
    _.debounce((frame: number, episode: string) => {
      setFullImageSrc(`${HOST}/image?frame=${frame}&episode=${episode}`);
    }, 300),
    []);
  const debounceChangeGifStart = useCallback(
    _.debounce((frame: number, episode: string) => {
      setGifStartImageSrc(`${HOST}/image?frame=${frame}&episode=${episode}`)
    }, 300),
    []);
  const debounceChangeGifEnd = useCallback(
    _.debounce((frame: number, episode: string) => {
      setGifEndImageSrc(`${HOST}/image?frame=${frame}&episode=${episode}`);
    }, 300),
    []);

  const handleSliderOnChange = (_: Event, value: number | number[], activeThumb: number) => {
    if (isGifMode === true) {
      debounceChangeGifStart((value as number[])[0], timelineEpisodeState);
      debounceChangeGifEnd((value as number[])[1], timelineEpisodeState);
      setGifRangeStartEnd(value as [number, number])
    } else {
      debounceChangeCurrentFrame(value as number, timelineEpisodeState);
      setCurrentFrame(value as number);
    }
  }

  const handleGifStartInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const start = parseInt(event.target.value);
    debounceChangeGifStart(start, timelineEpisodeState);
    //const end = gifRangeStartEnd[1];
    //const delta = Math.max(start, end) - Math.min(start, end);
    setGifRangeStartEnd([start, gifRangeStartEnd[1]]);

  }

  const handleGifEndInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const end = parseInt(event.target.value);
    debounceChangeGifEnd(end, timelineEpisodeState);
    //const start = gifRangeStartEnd[0];
    //const delta = Math.max(start, end) - Math.min(start, end);
    setGifRangeStartEnd([gifRangeStartEnd[0], end]);
  }

  const handleIsGifModeOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsGifMode(event.target.checked);
    if (event.target.checked === true) {
      setGifRangeStartEnd([...frameRangeStartEnd]);
      setGifStartImageSrc(`${HOST}/image?frame=${frameRangeStartEnd[0]}&episode=${timelineEpisodeState}`);
      setGifEndImageSrc(`${HOST}/image?frame=${frameRangeStartEnd[1]}&episode=${timelineEpisodeState}`);
    }
  }

  const handleGifGenerateOnClick = (event: React.UIEvent<HTMLButtonElement>) => {
    setFullImageSrc(`${HOST}/gif?start=${gifRangeStartEnd[0]}&end=${gifRangeStartEnd[1]}&episode=${timelineEpisodeState}`);
  }

  const handleReverseOnClick = (event: React.UIEvent<HTMLButtonElement>) => {
    setGifStartImageSrc(`${HOST}/image?frame=${gifRangeStartEnd[1]}&episode=${timelineEpisodeState}`);
    setGifEndImageSrc(`${HOST}/image?frame=${gifRangeStartEnd[0]}&episode=${timelineEpisodeState}`);
    setGifRangeStartEnd([gifRangeStartEnd[1], gifRangeStartEnd[0]]);
  }

  //const segment = data.result[segmentId];

  const delta = Math.abs(gifRangeStartEnd[0] - gifRangeStartEnd[1]);

  const isGifValidRange: boolean = delta <= 240
    && gifRangeStartEnd[0] >= 0
    && gifRangeStartEnd[1] >= 1;

  const sliderMin = (frameRangeStartEnd[0] + (isGifMode ? -120 : 0));
  const sliderMinClamp = Math.max(sliderMin, 0);
  const sliderMax = (frameRangeStartEnd[1] + (isGifMode ? 120 : 0));
  const sliderMaxClamp = sliderMax;

  const isReverse: boolean = gifRangeStartEnd[0] > gifRangeStartEnd[1];

  const preventScrollChangeInput = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
    e.stopPropagation()
    e.preventDefault();
  }
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

        <div className="image-container"
          style={{
            background: "black",
            display: "flex",
            justifyContent: "space-between"
          }}>

          <div id="gif-start-end-container"
            style={{ marginLeft: isGifMode ? "0.5dvw" : "0dvw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <FormControlLabel
              className="gif-mode-switch"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: isGifMode ? "red" : "white"
                }
              }}
              control={<Switch checked={isGifMode} onChange={handleIsGifModeOnChange} />}
              label={isGifMode ? "GIF ON" : "GIF OFF"} />

            <img id="gif-start-frame" src={startImageSrc}
              className={isGifMode && isVisible ? "gif-start-end-frame-image-visible" : "gif-start-end-frame-image-hidden"}
              loading="lazy" />

            <Input id="input-gif-start"
              className={isGifMode ? "gif-start-end-input-visible" : "gif-start-end-input-hidden"}
              style={{ background: "white", color: isGifValidRange ? "black" : "red" }}
              type="number"
              value={gifRangeStartEnd[0]}
              error={isGifValidRange === false}
              onWheel={preventScrollChangeInput}
              onChange={handleGifStartInputChange} />

            <img id="gif-end-frame" src={endImageSrc}
              className={isGifMode && isVisible ? "gif-start-end-frame-image-visible" : "gif-start-end-frame-image-hidden"}
              loading="lazy" />

            <Input id="input-gif-end"
              className={isGifMode ? "gif-start-end-input-visible" : "gif-start-end-input-hidden"}
              style={{ background: "white", color: isGifValidRange ? "black" : "red" }}
              type="number"
              value={gifRangeStartEnd[1]}
              error={isGifValidRange === false}
              onWheel={preventScrollChangeInput}
              onChange={handleGifEndInputChange} />

          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <Button
              variant="contained"
              color={isGifValidRange ? "primary" : "error"}
              sx={{
                backgroundColor: "white",
                color: "black"
              }}
              onClick={handleGifGenerateOnClick}
              endIcon={isGifValidRange ? (<ArrowDownward />) : (<CloseIcon />)}
              disabled={isGifValidRange === false}
              className={isGifMode && isVisible ? "generate-button-visible" : "generate-button-hidden"}>
              {"點擊產生GIF (最多10秒/240幀)"}
            </Button>

            <img id="result-image"
              className={isGifMode ? "full-image-gif-mode-on" : "full-image"}
              src={fullImageSrc}
              loading="lazy" />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black"
              }}
              startIcon={isReverse ? <FastRewind /> : <FastForward />}
              onClick={handleReverseOnClick}
              className={isGifMode && isVisible ? "generate-button-visible" : "generate-button-hidden"}>
              {`倒轉 ${gifRangeStartEnd[0]} ~ ${gifRangeStartEnd[1]} (${(delta / 24).toFixed(3)}秒 / ${delta}幀)`}
            </Button>

          </div>
          <CloseIcon className="close-button"
            onClick={function (e) {
              setFullImageSrc("");
              setIsVisible(false);
              setIsGifMode(false);
              //setSegment({is_visible: false, ...segment})
              setCurrentFrame(0);
            }} />
        </div>

        {
          (<Tooltip title={`${frameRangeStartEnd[0]}~${frameRangeStartEnd[1]} ${currentFrame}`}>
            <Chip
              style={{ position: large ? "absolute" : "relative", left: large ? "0dvw" : "45dvw" }}
              sx={{ backgroundColor: SITE_THEME_COLOR, color: "white" }}
              label={`${currentFrame - frameRangeStartEnd[0]}/${frameRangeStartEnd[1] - frameRangeStartEnd[0]}`} />
          </Tooltip>)
        }
        <Slider
          id="frame-slider"
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
            },
            "& .MuiSlider-valueLabel": {
              backgroundColor: SITE_THEME_COLOR,
              color: "white",
            }
          }}
          onChange={handleSliderOnChange}
          valueLabelDisplay="on"
          style={{ marginTop: "7dvh", marginLeft: "10dvw", marginRight: "10dvw", width: "80dvw", height: "0px" }}
          value={isGifMode ? gifRangeStartEnd : currentFrame}
          marks
          step={1}
          min={sliderMinClamp}
          max={sliderMaxClamp} />

        <Timeline
          setTimelineEpisodeState={setTimelineEpisodeState}
          setFullImageSrc={setFullImageSrc}
          isGifMode={isGifMode}
          setGifRangeStartEnd={setGifRangeStartEnd}
          setGifStartImageSrc={setGifStartImageSrc}
          setGifEndImageSrc={setGifEndImageSrc}
          setSegmentId={setSegmentId}
          setCurrentFrame={setCurrentFrame}
          setFrameRangeStartEnd={setFrameRangeStartEnd}
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
  isGifMode,
  setGifRangeStartEnd,
  setGifStartImageSrc,
  setGifEndImageSrc,
  setSegmentId,
  segmentIdRef,
  setFrameRangeStartEnd,
  setCurrentFrame,
}:
  {
    setTimelineEpisodeState: React.Dispatch<string>
    setFullImageSrc: React.Dispatch<string>,
    isGifMode: boolean,
    setGifRangeStartEnd: React.Dispatch<[number, number]>,
    setGifStartImageSrc: React.Dispatch<string>,
    setGifEndImageSrc: React.Dispatch<string>,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    setFrameRangeStartEnd: React.Dispatch<[number, number]>,
    setCurrentFrame: React.Dispatch<number>,
  }) {
  const sg = data.result[segmentIdRef.current];
  const pos = sg.segment_id;
  const slice = getTimelineSlice(pos);
  const sliceRef = useRef(slice);
  sliceRef.current = slice;
  const isGifModeRef = useRef(isGifMode);
  isGifModeRef.current = isGifMode;
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
  const currentIndex = slice.findIndex((e) => { return sg.segment_id === e.segment_id });
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
    if (isGifModeRef.current === true) {
      setGifRangeStartEnd([seg.frame_start, seg.frame_end]);
      setGifStartImageSrc(`${HOST}/image?frame=${seg.frame_start}&episode=${seg.episode}`);
      setGifEndImageSrc(`${HOST}/image?frame=${seg.frame_end}&episode=${seg.episode}`)
    } else {
      setFullImageSrc(`${HOST}/image?frame=${seg.frame_start}&episode=${seg.episode}`);
    }
    setFrameRangeStartEnd([seg.frame_start, seg.frame_end]);
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

  const theme = useTheme();
  const large: boolean = useMediaQuery(theme.breakpoints.up("sm"));

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
      <div style={{ position: "fixed", bottom: large ? "2dvh" : "5dvh", width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
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
        src={`${CDN}/thumb/${THUMB_PATH}/${result.episode}__${result.frame_start}.jpg`} />
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
  setFrameRangeStartEnd: setFrameStartEnd,
  setCurrentFrame }:
  {
    resultList: any[],
    setTimelineEpisodeState: React.Dispatch<string>,
    setFullImageSrc: React.Dispatch<string>,
    setIsVisible: React.Dispatch<boolean>,
    //setSegment: React.Dispatch<any>,
    setSegmentId: React.Dispatch<number>,
    segmentIdRef: React.MutableRefObject<number>
    setFrameRangeStartEnd: React.Dispatch<[number, number]>
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