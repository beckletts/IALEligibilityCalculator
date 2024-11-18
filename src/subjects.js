// subjects.js
export const subjects = {
  ACCOUNTING: {
    name: "Accounting",
    units: [
      { code: "WAC11", name: "Unit 1: The Accounting System and Costing" },
      { code: "WAC12", name: "Unit 2: Corporate and Management Accounting" },
    ],
    criteria: {
      AS: ["WAC11"],
      A: ["WAC11", "WAC12"],
    },
  },
  ARABIC: {
    name: "Arabic",
    units: [
      { code: "WAA01", name: "Unit 1: Understanding and Written Response" },
      { code: "WAA02", name: "Unit 2: Research, Writing and Research" },
    ],
    criteria: {
      AS: ["WAA01"],
      A: ["WAA01", "WAA02"],
    },
  },
  BIOLOGY: {
    name: "Biology",
    units: [
      { code: "WBI11", name: "Unit 1: Molecules, Diet, Transport and Health" },
      {
        code: "WBI12",
        name: "Unit 2: Cells, Development, Biodiversity and Conservation",
      },
      { code: "WBI13", name: "Unit 3: Practical Skills in Biology I" },
      {
        code: "WBI14",
        name: "Unit 4: Energy, Environment, Microbiology and Immunity",
      },
      {
        code: "WBI15",
        name: "Unit 5: Respiration, Internal Environment, Coordination and Gene Technology",
      },
      { code: "WBI16", name: "Unit 6: Practical Skills in Biology II" },
    ],
    criteria: {
      AS: ["WBI11", "WBI12", "WBI13"],
      A: ["WBI11", "WBI12", "WBI13", "WBI14", "WBI15", "WBI16"],
    },
  },
  BUSINESS: {
    name: "Business",
    units: [
      { code: "WBS11", name: "Unit 1: Marketing and people" },
      { code: "WBS12", name: "Unit 2: Managing business activities" },
      { code: "WBS13", name: "Unit 3: Business decisions and strategy" },
      { code: "WBS14", name: "Unit 4: Global business" },
    ],
    criteria: {
      AS: ["WBS11", "WBS12"],
      A: ["WBS11", "WBS12", "WBS13", "WBS14"],
    },
  },
  CHEMISTRY: {
    name: "Chemistry",
    units: [
      {
        code: "WCH11",
        name: "Unit 1: Structure, Bonding and Introduction to Organic Chemistry",
      },
      {
        code: "WCH12",
        name: "Unit 2: Energetics, Group Chemistry, Halogenoalkanes and Alcohols",
      },
      { code: "WCH13", name: "Unit 3: Practical Skills in Chemistry I" },
      {
        code: "WCH14",
        name: "Unit 4: Rates, Equilibria and Further Organic Chemistry",
      },
      {
        code: "WCH15",
        name: "Unit 5: Transition Metals and Organic Nitrogen Chemistry",
      },
      { code: "WCH16", name: "Unit 6: Practical Skills in Chemistry II" },
    ],
    criteria: {
      AS: ["WCH11", "WCH12", "WCH13"],
      A: ["WCH11", "WCH12", "WCH13", "WCH14", "WCH15", "WCH16"],
    },
  },
  ECONOMICS: {
    name: "Economics",
    units: [
      { code: "WEC11", name: "Unit 1: Markets in Action" },
      { code: "WEC12", name: "Unit 2: Macroeconomic Performance and Policy" },
      { code: "WEC13", name: "Unit 3: Business Behaviour" },
      { code: "WEC14", name: "Unit 4: Developments in the Global Economy" },
    ],
    criteria: {
      AS: ["WEC11", "WEC12"],
      A: ["WEC11", "WEC12", "WEC13", "WEC14"],
    },
  },
  ENGLISH_LANGUAGE: {
    name: "English Language",
    units: [
      { code: "WEN01", name: "Unit 1: Language: Context and Identity" },
      { code: "WEN02", name: "Unit 2: Language in Transition" },
      { code: "WEN03", name: "Unit 3: Crafting Language (Writing)" },
      { code: "WEN04", name: "Unit 4: Investigating Language" },
    ],
    criteria: {
      AS: ["WEN01", "WEN02"],
      A: ["WEN01", "WEN02", "WEN03", "WEN04"],
    },
  },
  ENGLISH_LITERATURE: {
    name: "English Literature",
    units: [
      { code: "WET01", name: "Unit 1: Post-2000 Poetry and Prose" },
      { code: "WET02", name: "Unit 2: Drama" },
      { code: "WET03", name: "Unit 3: Poetry and Prose" },
      { code: "WET04", name: "Unit 4: Shakespeare and Pre-1900 Poetry" },
    ],
    criteria: {
      AS: ["WET01", "WET02"],
      A: ["WET01", "WET02", "WET03", "WET04"],
    },
  },
  FRENCH: {
    name: "French",
    units: [
      { code: "WFR01", name: "Unit 1: Spoken Expression and Response" },
      { code: "WFR02", name: "Unit 2: Understanding and Written Response" },
      { code: "WFR03", name: "Unit 3: Understanding and Spoken Response" },
      {
        code: "WFR04",
        name: "Unit 4: Research, Understanding and Written Response",
      },
    ],
    criteria: {
      AS: ["WFR01", "WFR02"],
      A: ["WFR01", "WFR02", "WFR03", "WFR04"],
    },
  },
  GEOGRAPHY: {
    name: "Geography",
    units: [
      { code: "WGE01", name: "Unit 1: Global Challenges" },
      { code: "WGE02", name: "Unit 2: Geographical Investigations" },
      { code: "WGE03", name: "Unit 3: Contested Planet" },
      { code: "WGE04", name: "Unit 4: Researching Geography" },
    ],
    criteria: {
      AS: ["WGE01", "WGE02"],
      A: ["WGE01", "WGE02", "WGE03", "WGE04"],
    },
  },
  GERMAN: {
    name: "German",
    units: [
      { code: "WGN01", name: "Unit 1: Spoken Expression and Response" },
      { code: "WGN02", name: "Unit 2: Understanding and Written Response" },
      { code: "WGN03", name: "Unit 3: Understanding and Spoken Response" },
      {
        code: "WGN04",
        name: "Unit 4: Research, Understanding and Written Response",
      },
    ],
    criteria: {
      AS: ["WGN01", "WGN02"],
      A: ["WGN01", "WGN02", "WGN03", "WGN04"],
    },
  },
  GREEK: {
    name: "Greek",
    units: [
      { code: "WGK01", name: "Unit 1: Understanding and Written Response" },
      { code: "WGK02", name: "Unit 2: Writing and Research" },
    ],
    criteria: {
      AS: ["WGK01"],
      A: ["WGK01", "WGK02"],
    },
  },
  HISTORY: {
    name: "History",
    units: [
      { code: "WHI01", name: "Unit 1: Historical Themes" },
      { code: "WHI02", name: "Unit 2: Historical Investigation" },
      { code: "WHI03", name: "Unit 3: Thematic Study with Source Evaluation" },
      { code: "WHI04", name: "Unit 4: Historical Research" },
    ],
    criteria: {
      AS: ["WHI01", "WHI02"],
      A: ["WHI01", "WHI02", "WHI03", "WHI04"],
    },
  },
  IT: {
    name: "Information Technology",
    units: [
      { code: "WIT11", name: "Unit 1: Information, Systems and Applications" },
      {
        code: "WIT12",
        name: "Unit 2: Understanding the Tools and Techniques of IT",
      },
      {
        code: "WIT13",
        name: "Unit 3: Using Technology in Business and Industry",
      },
      { code: "WIT14", name: "Unit 4: Relational Database Project" },
    ],
    criteria: {
      AS: ["WIT11", "WIT12"],
      A: ["WIT11", "WIT12", "WIT13", "WIT14"],
    },
  },
  LAW: {
    name: "Law",
    units: [{ code: "YLA1", name: "Law (Papers 1 & 2)" }],
    criteria: {
      A: ["YLA1"],
    },
    note: "Law is a linear qualification with no AS Level available",
  },
  MATHEMATICS: {
    name: "Mathematics",
    units: [
      { code: "WMA11", name: "Pure Maths P1" },
      { code: "WMA12", name: "Pure Maths P2" },
      { code: "WMA13", name: "Pure Maths P3" },
      { code: "WMA14", name: "Pure Maths P4" },
      { code: "WME01", name: "Mechanics M1" },
      { code: "WME02", name: "Mechanics M2" },
      { code: "WST01", name: "Statistics S1" },
      { code: "WST02", name: "Statistics S2" },
      { code: "WDM11", name: "Decision D1" },
    ],
    criteria: {
      AS: {
        required: ["WMA11", "WMA12"],
        oneOf: ["WME01", "WST01", "WDM11"],
      },
      A: {
        required: ["WMA11", "WMA12", "WMA13", "WMA14"],
        pairs: [
          ["WME01", "WST01"],
          ["WME01", "WDM11"],
          ["WME01", "WME02"],
          ["WST01", "WDM11"],
          ["WST01", "WST02"],
        ],
      },
    },
  },
  FURTHER_MATHEMATICS: {
    name: "Further Mathematics",
    units: [
      { code: "WFM01", name: "Further Pure F1" },
      { code: "WFM02", name: "Further Pure F2" },
      { code: "WFM03", name: "Further Pure F3" },
      { code: "WME01", name: "Mechanics M1" },
      { code: "WME02", name: "Mechanics M2" },
      { code: "WME03", name: "Mechanics M3" },
      { code: "WST01", name: "Statistics S1" },
      { code: "WST02", name: "Statistics S2" },
      { code: "WST03", name: "Statistics S3" },
      { code: "WDM11", name: "Decision D1" },
    ],
    criteria: {
      AS: {
        required: ["WFM01"],
        twoFrom: [
          "WFM02",
          "WFM03",
          "WME01",
          "WME02",
          "WME03",
          "WST01",
          "WST02",
          "WST03",
          "WDM11",
        ],
      },
      A: {
        options: [
          {
            required: ["WFM01"],
            oneFromFurther: ["WFM02", "WFM03"],
            fourFromApps: [
              "WME01",
              "WME02",
              "WME03",
              "WST01",
              "WST02",
              "WST03",
              "WDM11",
            ],
          },
          {
            required: ["WFM01", "WFM02", "WFM03"],
            threeFromApps: [
              "WME01",
              "WME02",
              "WME03",
              "WST01",
              "WST02",
              "WST03",
              "WDM11",
            ],
          },
        ],
      },
    },
  },
  PURE_MATHEMATICS: {
    name: "Pure Mathematics",
    units: [
      { code: "WMA11", name: "Pure Maths P1" },
      { code: "WMA12", name: "Pure Maths P2" },
      { code: "WMA13", name: "Pure Maths P3" },
      { code: "WMA14", name: "Pure Maths P4" },
      { code: "WFM01", name: "Further Pure F1" },
      { code: "WFM02", name: "Further Pure F2" },
      { code: "WFM03", name: "Further Pure F3" },
    ],
    criteria: {
      AS: ["WMA11", "WMA12", "WFM01"],
      A: {
        required: ["WMA11", "WMA12", "WMA13", "WMA14", "WFM01"],
        oneOf: ["WFM02", "WFM03"],
      },
    },
  },
  PHYSICS: {
    name: "Physics",
    units: [
      { code: "WPH11", name: "Unit 1: Mechanics and Materials" },
      { code: "WPH12", name: "Unit 2: Waves and Electricity" },
      { code: "WPH13", name: "Unit 3: Practical Skills in Physics I" },
      {
        code: "WPH14",
        name: "Unit 4: Further Mechanics, Fields and Particles",
      },
      {
        code: "WPH15",
        name: "Unit 5: Thermodynamics, Radiation, Oscillations and Cosmology",
      },
      { code: "WPH16", name: "Unit 6: Practical Skills in Physics II" },
    ],
    criteria: {
      AS: ["WPH11", "WPH12", "WPH13"],
      A: ["WPH11", "WPH12", "WPH13", "WPH14", "WPH15", "WPH16"],
    },
  },
  PSYCHOLOGY: {
    name: "Psychology",
    units: [
      { code: "WPS01", name: "Unit 1: Social and Cognitive Psychology" },
      {
        code: "WPS02",
        name: "Unit 2: Biological Psychology, Learning Theories and Development",
      },
      { code: "WPS03", name: "Unit 3: Applications of Psychology" },
      {
        code: "WPS04",
        name: "Unit 4: Clinical Psychology and Psychological Skills",
      },
    ],
    criteria: {
      AS: ["WPS01", "WPS02"],
      A: ["WPS01", "WPS02", "WPS03", "WPS04"],
    },
  },
  SPANISH: {
    name: "Spanish",
    units: [
      { code: "WSP01", name: "Unit 1: Spoken Expression and Response" },
      { code: "WSP02", name: "Unit 2: Understanding and Written Response" },
      { code: "WSP03", name: "Unit 3: Understanding and Spoken Response" },
      {
        code: "WSP04",
        name: "Unit 4: Research, Understanding and Written Response",
      },
    ],
    criteria: {
      AS: ["WSP01", "WSP02"],
      A: ["WSP01", "WSP02", "WSP03", "WSP04"],
    },
  },
};
