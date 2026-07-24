"use client";

import { useState } from "react";

type Fixture = { field: string; time: string; home: string; away: string };
type Round = { label: string; fixtures: Fixture[] };
type Pool = { label?: string; rounds: Round[] };
type AgeGroup = {
  id: string;
  label: string;
  gender: "Boys" | "Girls";
  venue: string;
  pools: Pool[];
};

const GROUPS: AgeGroup[] = [
  // ── GIRLS ──────────────────────────────────────────────────────────────────
  {
    id: "u10g",
    label: "U10 Girls",
    gender: "Girls",
    venue: "Jubilee Fields",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Jubilee 7", time: "9:00am", home: "WCW Black", away: "Dubbo 9's" },
              { field: "Jubilee 8", time: "9:00am", home: "Hanwood", away: "AWFA" },
              { field: "Jubilee 9", time: "9:00am", home: "Forbes", away: "Dubbo 10's" },
            ],
          },
          {
            label: "Round 2 — 10:45am",
            fixtures: [
              { field: "Jubilee 7", time: "10:45am", home: "WCW Black", away: "Dubbo 10's" },
              { field: "Jubilee 8", time: "10:45am", home: "Hanwood", away: "Dubbo 9's" },
              { field: "Jubilee 9", time: "10:45am", home: "Forbes", away: "AWFA" },
            ],
          },
          {
            label: "Round 3 — 12:30pm",
            fixtures: [
              { field: "Jubilee 7", time: "12:30pm", home: "WCW Black", away: "Hanwood" },
              { field: "Jubilee 8", time: "12:30pm", home: "Dubbo 10's", away: "AWFA" },
              { field: "Jubilee 9", time: "12:30pm", home: "Forbes", away: "Dubbo 9's" },
            ],
          },
          {
            label: "Round 4 — 2:15pm",
            fixtures: [
              { field: "Jubilee 7", time: "2:15pm", home: "WCW Black", away: "Forbes" },
              { field: "Jubilee 8", time: "2:15pm", home: "Dubbo 10's", away: "Hanwood" },
              { field: "Jubilee 9", time: "2:15pm", home: "Dubbo 9's", away: "AWFA" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u11g",
    label: "U11 Girls",
    gender: "Girls",
    venue: "Jubilee Fields",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 9:35am",
            fixtures: [
              { field: "Jubilee 7", time: "9:35am", home: "Canberra Olympic White", away: "Dubbo 11's" },
              { field: "Jubilee 8", time: "9:35am", home: "WCW White", away: "Leeton 11's" },
              { field: "Jubilee 9", time: "9:35am", home: "Hanwood 11's", away: "Canberra Olympic Blue" },
            ],
          },
          {
            label: "Round 2 — 11:20am",
            fixtures: [
              { field: "Jubilee 7", time: "11:20am", home: "WCW White", away: "Dubbo 11's" },
              { field: "Jubilee 8", time: "11:20am", home: "Canberra Olympic Blue", away: "Leeton 11's" },
              { field: "Jubilee 9", time: "11:20am", home: "Canberra Olympic White", away: "Hanwood 11's" },
            ],
          },
          {
            label: "Round 3 — 1:05pm",
            fixtures: [
              { field: "Jubilee 7", time: "1:05pm", home: "WCW White", away: "Canberra Olympic Blue" },
              { field: "Jubilee 8", time: "1:05pm", home: "Canberra Olympic White", away: "Leeton 11's" },
              { field: "Jubilee 9", time: "1:05pm", home: "Hanwood 11's", away: "Dubbo 11's" },
            ],
          },
          {
            label: "Round 4 — 2:50pm",
            fixtures: [
              { field: "Jubilee 7", time: "2:50pm", home: "Hanwood 11's", away: "Leeton 11's" },
              { field: "Jubilee 8", time: "2:50pm", home: "WCW White", away: "Canberra Olympic White" },
              { field: "Jubilee 9", time: "2:50pm", home: "Dubbo 11's", away: "Canberra Olympic Blue" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u12g",
    label: "U12 Girls",
    gender: "Girls",
    venue: "Jubilee Fields",
    pools: [
      {
        rounds: [
          {
            label: "Round 1",
            fixtures: [
              { field: "Jubilee 7", time: "10:10am", home: "WCW Black", away: "GFA" },
              { field: "Jubilee 8", time: "10:10am", home: "Hanwood", away: "STFA Mustangs" },
              { field: "Jubilee 9", time: "10:10am", home: "AWFA Red", away: "Canberra Olympic" },
              { field: "Jubilee 10", time: "10:10am", home: "AWFA Black", away: "Dubbo" },
              { field: "Jubilee 10", time: "9:35am", home: "WCW Black 11s", away: "Orange" },
            ],
          },
          {
            label: "Round 2",
            fixtures: [
              { field: "Jubilee 7", time: "11:55am", home: "WCW Black", away: "Dubbo" },
              { field: "Jubilee 8", time: "11:55am", home: "WCW Black 11s", away: "GFA" },
              { field: "Jubilee 9", time: "11:55am", home: "AWFA Red", away: "STFA Mustangs" },
              { field: "Jubilee 10", time: "11:55am", home: "AWFA Black", away: "Canberra Olympic" },
              { field: "Jubilee 10", time: "11:20am", home: "Hanwood", away: "Orange" },
            ],
          },
          {
            label: "Round 3",
            fixtures: [
              { field: "Jubilee 7", time: "1:40pm", home: "WCW Black", away: "Canberra Olympic" },
              { field: "Jubilee 8", time: "1:40pm", home: "Hanwood", away: "Dubbo" },
              { field: "Jubilee 9", time: "1:40pm", home: "AWFA Red", away: "GFA" },
              { field: "Jubilee 10", time: "1:40pm", home: "AWFA Black", away: "Orange" },
              { field: "Jubilee 10", time: "1:05pm", home: "WCW Black 11s", away: "STFA Mustangs" },
            ],
          },
          {
            label: "Round 4",
            fixtures: [
              { field: "Jubilee 7", time: "3:25pm", home: "WCW Black", away: "STFA Mustangs" },
              { field: "Jubilee 8", time: "3:25pm", home: "Hanwood", away: "Canberra Olympic" },
              { field: "Jubilee 9", time: "3:25pm", home: "AWFA Red", away: "Dubbo" },
              { field: "Jubilee 10", time: "3:25pm", home: "Orange", away: "GFA" },
              { field: "Jubilee 10", time: "2:50pm", home: "WCW Black 11s", away: "AWFA Black" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u14g",
    label: "U14 Girls",
    gender: "Girls",
    venue: "Rawlings Park",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 10:45am",
            fixtures: [
              { field: "Rawlings 5", time: "10:45am", home: "FWW 13's", away: "Southern Tablelands" },
              { field: "Rawlings 6", time: "10:45am", home: "FWW 14's", away: "Hanwood FC" },
              { field: "Rawlings 1", time: "10:45am", home: "AWFA", away: "Western NSW" },
            ],
          },
          {
            label: "Round 2 — 1:05pm",
            fixtures: [
              { field: "Rawlings 5", time: "1:05pm", home: "FWW 13's", away: "Western NSW" },
              { field: "Rawlings 6", time: "1:05pm", home: "FWW 14's", away: "AWFA" },
              { field: "Rawlings 1", time: "1:05pm", home: "Southern Tablelands", away: "Hanwood FC" },
            ],
          },
          {
            label: "Round 3 — 3:25pm",
            fixtures: [
              { field: "Rawlings 5", time: "3:25pm", home: "FWW 13's", away: "Hanwood FC" },
              { field: "Rawlings 6", time: "3:25pm", home: "FWW 14's", away: "Western NSW" },
              { field: "Rawlings 1", time: "3:25pm", home: "AWFA", away: "Southern Tablelands" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u16g",
    label: "U16 Girls",
    gender: "Girls",
    venue: "Rawlings Park",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Rawlings 1", time: "9:00am", home: "AWFA", away: "FWW" },
            ],
          },
          {
            label: "Round 2 — 11:20am",
            fixtures: [
              { field: "Rawlings 1", time: "11:20am", home: "AWFA", away: "Western NSW" },
            ],
          },
          {
            label: "Round 3 — 1:40pm",
            fixtures: [
              { field: "Rawlings 1", time: "1:40pm", home: "FWW", away: "AWFA" },
            ],
          },
        ],
      },
    ],
  },

  // ── BOYS ───────────────────────────────────────────────────────────────────
  {
    id: "u9b",
    label: "U9 Boys",
    gender: "Boys",
    venue: "Jubilee Fields",
    pools: [
      {
        label: "Pool A",
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Jubilee 11A", time: "9:00am", home: "WCW Gold", away: "Dubbo" },
              { field: "Jubilee 11B", time: "9:00am", home: "Hanwood 8's", away: "Forbes" },
              { field: "Jubilee 12A", time: "9:00am", home: "WCW White", away: "RAFA" },
            ],
          },
          {
            label: "Round 2 — 10:10am",
            fixtures: [
              { field: "Jubilee 11A", time: "10:10am", home: "Dubbo", away: "Forbes" },
              { field: "Jubilee 11B", time: "10:10am", home: "WCW White", away: "Hanwood 8's" },
              { field: "Jubilee 12A", time: "10:10am", home: "WCW Gold", away: "RAFA" },
            ],
          },
          {
            label: "Round 3 — 11:20am",
            fixtures: [
              { field: "Jubilee 11A", time: "11:20am", home: "WCW Gold", away: "Forbes" },
              { field: "Jubilee 11B", time: "11:20am", home: "WCW White", away: "Dubbo" },
              { field: "Jubilee 12A", time: "11:20am", home: "Hanwood 8's", away: "RAFA" },
            ],
          },
          {
            label: "Round 4 — 12:30pm",
            fixtures: [
              { field: "Jubilee 11A", time: "12:30pm", home: "Canberra Olympic", away: "RAFA" },
              { field: "Jubilee 11B", time: "12:30pm", home: "Forbes", away: "GFA Black" },
              { field: "Jubilee 12A", time: "12:30pm", home: "WCW Gold", away: "Hanwood 8's" },
            ],
          },
        ],
      },
      {
        label: "Pool B",
        rounds: [
          {
            label: "Round 1 — 9:35am",
            fixtures: [
              { field: "Jubilee 11A", time: "9:35am", home: "WCW Black", away: "GFA Black" },
              { field: "Jubilee 11B", time: "9:35am", home: "SWS", away: "GFA Green" },
              { field: "Jubilee 12A", time: "9:35am", home: "Hanwood 9", away: "Canberra Olympic" },
            ],
          },
          {
            label: "Round 2 — 10:45am",
            fixtures: [
              { field: "Jubilee 11A", time: "10:45am", home: "WCW Black", away: "Canberra Olympic" },
              { field: "Jubilee 11B", time: "10:45am", home: "SWS", away: "GFA Black" },
              { field: "Jubilee 12A", time: "10:45am", home: "Hanwood 9", away: "GFA Green" },
            ],
          },
          {
            label: "Round 3 — 11:55am",
            fixtures: [
              { field: "Jubilee 11A", time: "11:55am", home: "WCW Black", away: "GFA Green" },
              { field: "Jubilee 11B", time: "11:55am", home: "GFA Black", away: "Canberra Olympic" },
              { field: "Jubilee 12A", time: "11:55am", home: "Hanwood 9", away: "SWS" },
            ],
          },
          {
            label: "Round 4 — 1:05pm",
            fixtures: [
              { field: "Jubilee 11A", time: "1:05pm", home: "WCW Black", away: "Hanwood 9's" },
              { field: "Jubilee 11B", time: "1:05pm", home: "WCW White", away: "SWS" },
              { field: "Jubilee 12A", time: "1:05pm", home: "Dubbo", away: "GFA Green" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u10b",
    label: "U10 Boys",
    gender: "Boys",
    venue: "Jubilee Fields",
    pools: [
      {
        label: "Pool A",
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Jubilee 1", time: "9:00am", home: "WCW Black", away: "GFA Green" },
              { field: "Jubilee 2", time: "9:00am", home: "Canberra Olympic Blue", away: "AWFA" },
            ],
          },
          {
            label: "Round 2 — 10:45am",
            fixtures: [
              { field: "Jubilee 1", time: "10:45am", home: "Tigers FC", away: "WCW Black" },
              { field: "Jubilee 2", time: "10:45am", home: "GFA Green", away: "Canberra Olympic Blue" },
            ],
          },
          {
            label: "Round 3 — 12:30pm",
            fixtures: [
              { field: "Jubilee 1", time: "12:30pm", home: "AWFA", away: "Tigers FC" },
              { field: "Jubilee 2", time: "12:30pm", home: "WCW Black", away: "Canberra Olympic Blue" },
            ],
          },
          {
            label: "Round 4 — 2:15pm",
            fixtures: [
              { field: "Jubilee 1", time: "2:15pm", home: "GFA Green", away: "AWFA" },
              { field: "Jubilee 2", time: "2:15pm", home: "Canberra Olympic Blue", away: "Tigers FC" },
            ],
          },
          {
            label: "Round 5",
            fixtures: [
              { field: "Jubilee 5", time: "10:10am", home: "WCW Black", away: "AWFA" },
              { field: "Jubilee 6", time: "10:10am", home: "Tigers FC", away: "GFA Green" },
            ],
          },
        ],
      },
      {
        label: "Pool B",
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Jubilee 3", time: "9:00am", home: "WCW White", away: "GFA Black" },
              { field: "Jubilee 4", time: "9:00am", home: "Canberra Olympic White", away: "Majura Blue" },
            ],
          },
          {
            label: "Round 2 — 10:45am",
            fixtures: [
              { field: "Jubilee 3", time: "10:45am", home: "Leeton Black", away: "WCW White" },
              { field: "Jubilee 4", time: "10:45am", home: "GFA Black", away: "Canberra Olympic White" },
            ],
          },
          {
            label: "Round 3 — 12:30pm",
            fixtures: [
              { field: "Jubilee 3", time: "12:30pm", home: "Majura Blue", away: "Leeton Black" },
              { field: "Jubilee 4", time: "12:30pm", home: "WCW White", away: "Canberra Olympic White" },
            ],
          },
          {
            label: "Round 4 — 2:15pm",
            fixtures: [
              { field: "Jubilee 3", time: "2:15pm", home: "GFA Black", away: "Majura Blue" },
              { field: "Jubilee 4", time: "2:15pm", home: "Canberra Olympic White", away: "Leeton Black" },
            ],
          },
          {
            label: "Round 5",
            fixtures: [
              { field: "Jubilee 5", time: "11:55am", home: "WCW White", away: "Majura Blue" },
              { field: "Jubilee 6", time: "11:55am", home: "Leeton Black", away: "GFA Black" },
            ],
          },
        ],
      },
      {
        label: "Pool C",
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Jubilee 5", time: "9:00am", home: "Forbes", away: "Hanwood" },
              { field: "Jubilee 6", time: "9:00am", home: "Leeton Red", away: "Southern Tablelands" },
            ],
          },
          {
            label: "Round 2 — 10:45am",
            fixtures: [
              { field: "Jubilee 5", time: "10:45am", home: "Majura White", away: "Forbes" },
              { field: "Jubilee 6", time: "10:45am", home: "Hanwood", away: "Leeton Red" },
            ],
          },
          {
            label: "Round 3 — 12:30pm",
            fixtures: [
              { field: "Jubilee 5", time: "12:30pm", home: "Southern Tablelands", away: "Majura White" },
              { field: "Jubilee 6", time: "12:30pm", home: "Forbes", away: "Leeton Red" },
            ],
          },
          {
            label: "Round 4 — 2:15pm",
            fixtures: [
              { field: "Jubilee 5", time: "2:15pm", home: "Hanwood", away: "Southern Tablelands" },
              { field: "Jubilee 6", time: "2:15pm", home: "Leeton Red", away: "Majura White" },
            ],
          },
          {
            label: "Round 5",
            fixtures: [
              { field: "Jubilee 5", time: "1:40pm", home: "Forbes", away: "Southern Tablelands" },
              { field: "Jubilee 6", time: "1:40pm", home: "Majura White", away: "Hanwood" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u11b",
    label: "U11 Boys",
    gender: "Boys",
    venue: "Jubilee Fields",
    pools: [
      {
        label: "Pool A",
        rounds: [
          {
            label: "Round 1 — 9:35am",
            fixtures: [
              { field: "Jubilee 1", time: "9:35am", home: "WCW Black", away: "GFA" },
              { field: "Jubilee 2", time: "9:35am", home: "Dubbo", away: "Canberra Olympic Blue" },
              { field: "Jubilee 3", time: "9:35am", home: "AWFA Black", away: "SWS" },
            ],
          },
          {
            label: "Round 2 — 11:20am",
            fixtures: [
              { field: "Jubilee 1", time: "11:20am", home: "WCW Black", away: "SWS" },
              { field: "Jubilee 2", time: "11:20am", home: "Dubbo", away: "GFA" },
              { field: "Jubilee 3", time: "11:20am", home: "AWFA Black", away: "Canberra Olympic Blue" },
            ],
          },
          {
            label: "Round 3 — 1:05pm",
            fixtures: [
              { field: "Jubilee 1", time: "1:05pm", home: "WCW Black", away: "AWFA Black" },
              { field: "Jubilee 2", time: "1:05pm", home: "SWS", away: "Dubbo" },
              { field: "Jubilee 3", time: "1:05pm", home: "GFA", away: "Canberra Olympic Blue" },
            ],
          },
          {
            label: "Round 4 — 2:50pm",
            fixtures: [
              { field: "Jubilee 1", time: "2:50pm", home: "AWFA Black", away: "Dubbo" },
              { field: "Jubilee 2", time: "2:50pm", home: "WCW Black", away: "Canberra Olympic Blue" },
              { field: "Jubilee 3", time: "2:50pm", home: "SWS", away: "GFA" },
            ],
          },
        ],
      },
      {
        label: "Pool B",
        rounds: [
          {
            label: "Round 1 — 9:35am",
            fixtures: [
              { field: "Jubilee 4", time: "9:35am", home: "WCW White", away: "Hanwood" },
              { field: "Jubilee 5", time: "9:35am", home: "Forbes", away: "Canberra Olympic White" },
              { field: "Jubilee 6", time: "9:35am", home: "AWFA Red", away: "Southern Tablelands" },
            ],
          },
          {
            label: "Round 2 — 11:20am",
            fixtures: [
              { field: "Jubilee 4", time: "11:20am", home: "WCW White", away: "Southern Tablelands" },
              { field: "Jubilee 5", time: "11:20am", home: "Forbes", away: "Hanwood" },
              { field: "Jubilee 6", time: "11:20am", home: "AWFA Red", away: "Canberra Olympic White" },
            ],
          },
          {
            label: "Round 3 — 1:05pm",
            fixtures: [
              { field: "Jubilee 4", time: "1:05pm", home: "WCW White", away: "Forbes" },
              { field: "Jubilee 5", time: "1:05pm", home: "AWFA Red", away: "Hanwood" },
              { field: "Jubilee 6", time: "1:05pm", home: "Canberra Olympic White", away: "Southern Tablelands" },
            ],
          },
          {
            label: "Round 4 — 2:50pm",
            fixtures: [
              { field: "Jubilee 4", time: "2:50pm", home: "Hanwood", away: "Canberra Olympic White" },
              { field: "Jubilee 5", time: "2:50pm", home: "Southern Tablelands", away: "Forbes" },
              { field: "Jubilee 6", time: "2:50pm", home: "WCW White", away: "AWFA Red" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u12b",
    label: "U12 Boys",
    gender: "Boys",
    venue: "Jubilee Fields",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 10:10am",
            fixtures: [
              { field: "Jubilee 1", time: "10:10am", home: "WCW Black", away: "AWFA" },
              { field: "Jubilee 2", time: "10:10am", home: "Canberra Olympic Blue", away: "Hanwood" },
              { field: "Jubilee 3", time: "10:10am", home: "WCW White", away: "Leeton" },
              { field: "Jubilee 4", time: "10:10am", home: "SWS", away: "GFA" },
            ],
          },
          {
            label: "Round 2 — 11:55am",
            fixtures: [
              { field: "Jubilee 1", time: "11:55am", home: "WCW Black", away: "Canberra Olympic Blue" },
              { field: "Jubilee 2", time: "11:55am", home: "AWFA", away: "Hanwood" },
              { field: "Jubilee 3", time: "11:55am", home: "GFA", away: "Canberra Olympic White" },
              { field: "Jubilee 4", time: "11:55am", home: "SWS", away: "Leeton" },
            ],
          },
          {
            label: "Round 3 — 1:40pm",
            fixtures: [
              { field: "Jubilee 1", time: "1:40pm", home: "Canberra Olympic White", away: "Hanwood" },
              { field: "Jubilee 2", time: "1:40pm", home: "AWFA", away: "Canberra Olympic Blue" },
              { field: "Jubilee 3", time: "1:40pm", home: "WCW White", away: "GFA" },
              { field: "Jubilee 4", time: "1:40pm", home: "Leeton", away: "WCW Black" },
            ],
          },
          {
            label: "Round 4 — 3:25pm",
            fixtures: [
              { field: "Jubilee 1", time: "3:25pm", home: "WCW Black", away: "Canberra Olympic White" },
              { field: "Jubilee 2", time: "3:25pm", home: "SWS", away: "WCW White" },
              { field: "Jubilee 3", time: "3:25pm", home: "AWFA", away: "GFA" },
              { field: "Jubilee 4", time: "3:25pm", home: "Canberra Olympic Blue", away: "Leeton" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u13b",
    label: "U13 Boys",
    gender: "Boys",
    venue: "Rawlings Park",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 10:10am",
            fixtures: [
              { field: "Rawlings 5", time: "10:10am", home: "FWW", away: "Hanwood FC" },
              { field: "Rawlings 6", time: "10:10am", home: "AWFA", away: "Gunghalin Black" },
              { field: "Rawlings 1", time: "10:10am", home: "Griffith Academy", away: "Gunghalin White" },
            ],
          },
          {
            label: "Round 2 — 12:30pm",
            fixtures: [
              { field: "Rawlings 5", time: "12:30pm", home: "Hanwood FC", away: "Gunghalin Black" },
              { field: "Rawlings 6", time: "12:30pm", home: "AWFA", away: "Gunghalin White" },
              { field: "Rawlings 1", time: "12:30pm", home: "Griffith Academy", away: "FWW" },
            ],
          },
          {
            label: "Round 3 — 2:50pm",
            fixtures: [
              { field: "Rawlings 5", time: "2:50pm", home: "FWW", away: "Gunghalin Black" },
              { field: "Rawlings 6", time: "2:50pm", home: "Gunghalin White", away: "Hanwood FC" },
              { field: "Rawlings 1", time: "2:50pm", home: "Griffith Academy", away: "AWFA" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u14b",
    label: "U14 Boys",
    gender: "Boys",
    venue: "Rawlings Park",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 9:35am",
            fixtures: [
              { field: "Rawlings 5", time: "9:35am", home: "FWW", away: "Hanwood FC" },
              { field: "Rawlings 6", time: "9:35am", home: "AWFA", away: "LUFC" },
            ],
          },
          {
            label: "Round 2 — 11:55am",
            fixtures: [
              { field: "Rawlings 5", time: "11:55am", home: "FWW", away: "LUFC" },
              { field: "Rawlings 6", time: "11:55am", home: "AWFA", away: "Hanwood FC" },
            ],
          },
          {
            label: "Round 3 — 2:15pm",
            fixtures: [
              { field: "Rawlings 5", time: "2:15pm", home: "FWW", away: "AWFA" },
              { field: "Rawlings 6", time: "2:15pm", home: "Hanwood FC", away: "LUFC" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u16b",
    label: "U16 Boys",
    gender: "Boys",
    venue: "Rawlings Park",
    pools: [
      {
        rounds: [
          {
            label: "Round 1 — 9:00am",
            fixtures: [
              { field: "Rawlings 5", time: "9:00am", home: "FWW", away: "AWFA 15's" },
              { field: "Rawlings 6", time: "9:00am", home: "AWFA 16's", away: "GFA" },
            ],
          },
          {
            label: "Round 2 — 11:20am",
            fixtures: [
              { field: "Rawlings 5", time: "11:20am", home: "AWFA 15's", away: "AWFA 16's" },
              { field: "Rawlings 6", time: "11:20am", home: "FWW", away: "GFA" },
            ],
          },
          {
            label: "Round 3 — 1:40pm",
            fixtures: [
              { field: "Rawlings 5", time: "1:40pm", home: "FWW", away: "AWFA 16's" },
              { field: "Rawlings 6", time: "1:40pm", home: "AWFA 15's", away: "GFA" },
            ],
          },
        ],
      },
    ],
  },
];

const POOL_COLOURS = [
  "bg-brand/10 text-brand border-brand/20",
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-amber-50 text-amber-700 border-amber-200",
];

export default function GalaDayPage() {
  const [activeId, setActiveId] = useState("u10g");

  const boys = GROUPS.filter((g) => g.gender === "Boys");
  const girls = GROUPS.filter((g) => g.gender === "Girls");
  const group = GROUPS.find((g) => g.id === activeId)!;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            FNSW Gala Day
          </span>
          <span className="text-muted text-sm">5 April 2026 · Wagga Wagga</span>
        </div>
        <h1 className="text-3xl font-black text-navy mb-3">2026 Gala Day Draw</h1>
        <p className="text-muted text-sm max-w-xl">
          Academy &amp; SAP Gala Day hosted by Football Wagga Wagga. 98 teams from across NSW competing at two venues.
        </p>

        {/* Venues */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-sm">
            <span className="text-lg">🏟️</span>
            <div>
              <p className="font-semibold text-navy">Jubilee Fields</p>
              <p className="text-muted text-xs">12 pitches · U8–U12</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-sm">
            <span className="text-lg">⚽</span>
            <div>
              <p className="font-semibold text-navy">Rawlings Park</p>
              <p className="text-muted text-xs">3 pitches · U13–U16</p>
            </div>
          </div>
        </div>
      </div>

      {/* Age group selector */}
      <div className="mb-6 space-y-3">
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">Girls</p>
          <div className="flex flex-wrap gap-2">
            {girls.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  activeId === g.id
                    ? "bg-brand text-white border-brand"
                    : "bg-white border-border text-navy hover:border-brand hover:text-brand"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-muted uppercase mb-2">Boys</p>
          <div className="flex flex-wrap gap-2">
            {boys.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  activeId === g.id
                    ? "bg-navy text-white border-navy"
                    : "bg-white border-border text-navy hover:border-navy/50"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Draw */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-black text-navy">{group.label}</h2>
          <span className="text-xs bg-navy/10 text-navy font-semibold px-2 py-0.5 rounded">
            {group.venue}
          </span>
        </div>

        {group.pools.map((pool, pi) => (
          <div key={pi} className="mb-8">
            {pool.label && (
              <div
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 ${POOL_COLOURS[pi % POOL_COLOURS.length]}`}
              >
                {pool.label}
              </div>
            )}

            <div className="space-y-5">
              {pool.rounds.map((round) => (
                <div key={round.label}>
                  <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
                    {round.label}
                  </p>
                  <div className="space-y-1.5">
                    {round.fixtures.map((f, fi) => (
                      <div
                        key={fi}
                        className="grid grid-cols-[auto_1fr] items-center gap-3 bg-white border border-border rounded-lg px-3 py-2.5 hover:border-navy/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="bg-navy/5 text-navy text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap">
                            {f.field}
                          </span>
                          <span className="text-muted text-xs whitespace-nowrap">{f.time}</span>
                        </div>
                        <div className="flex items-center justify-between min-w-0">
                          <span className="font-semibold text-navy text-sm truncate">{f.home}</span>
                          <span className="text-muted text-xs font-bold px-2 shrink-0">vs</span>
                          <span className="font-semibold text-navy text-sm truncate text-right">{f.away}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
