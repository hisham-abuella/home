<!--
  The CV lives here. Edit this file, then run:

      python3 tools/build_cv.py

  It rewrites the CV part of cv.html (between the CV:START and CV:END markers).
  Everything else in cv.html (buttons, styles, scripts) is left alone.
  `python3 tools/build_cv.py --check` tells you if cv.html is out of date.

  How each kind of line becomes HTML:
    # Name                       -> the name at the top
    lines right under the name   -> the contact block (one line each)
    ## Section                   -> a section title (shown as "- S E C T I O N -")
    ### Title                    -> a job or a degree
      next line                  -> its place and dates  (use | before the **dates**)
      - bullet                   -> a job bullet
      plain lines                -> degree details (Thesis, Advisor, Courses)
    - bullet (no ### above)      -> a normal list item
    1. text                      -> a numbered publication
    **Date:** text               -> a dated line (awards, activities)
    > text                       -> the footer line
  Inline: **bold**, [text](https://link). Links open in a new tab, except mailto.
-->

# Hisham Abuella

California, USA
[hisham.abuella1@gmail.com](mailto:hisham.abuella1@gmail.com)
DOB: 1992 | LinkedIn: [@hisham-abuella](https://www.linkedin.com/in/hisham-abuella-808b91171/)
Permanent Resident (Green Card holder valid till Feb. 2035)

## Summary of Qualifications

- 10+ years of research and engineering experience in wireless systems (includes PhD/MSc/Qualcomm/Apple)
- 5+ years of industry experience in simulation, fixed-point implementation of wireless systems, RF digital front-end, Digital Pre-Distortion, channel parameter estimation, lab bringup issues and debugging scripts.
- 10+ technical publications (including 1 U.S. patent).
- Knowledge of visible light sensing and communications, OFDM, wireless prototyping using software defined radio and raspberry-Pi, digital signal processing, RF frontend impairments, 5G baseband channel estimation, and machine learning algorithms for wireless communication.
- GenAI champion at Apple: built GenAI-based engineering tools, published a presentation skill with **2,500+ downloads** on the internal Claude marketplace, and authored a GenAI crash course visited by **6,000+** internal users.
- Skills on MATLAB, C, C++, LabVIEW, Python, GitHub, Visio, LaTeX, GenAI, Claude Code, WebApps and Vibe Coding.

## Work Experience

### Cellular System Engineer
Apple Inc., San Diego, USA | **June 2025 – now**
- Working in the AGC (Automatic Gain Control) team on cellular modem systems.
- Helping in Lab bringup issues and debugging.
- Serving as a GenAI champion and subject-matter expert for the wireless systems organization, advising engineers on where generative AI genuinely helps their work.
- Built multiple GenAI-based tools that analyze bringup and lab issues, simulator output, and system design documents.
- Used GenAI and Claude Code to improve debugging tools for bringup and lab issues, and to mine historical logs for data supporting diff studies and design decisions.
- Created a presentation-building skill published on Apple's internal Claude marketplace, passing **2,500+ downloads**.
- Wrote and delivered a GenAI and Claude 101 crash course for Apple internal users across the company, visited by **6,000+ people**.

### Senior Modem System Engineer
Qualcomm Inc., San Diego, USA | **June 2021 – June 2025**
- Worked with the mmWave and Sub6 Rx Digital Frontend (RxFE) teams, and contributed to channel parameter estimation for NR (New Radio) team.
- Developed scripts and tools for debugging RxFE lab issues and maintained parsers for legacy targets.
- Contributed to system documentation for the Rx Digital Frontend (RxFE) and channel parameter estimation.
- Supported FW, RF Sys, and SW teams during chip bring-up and assisted in debugging RxFE lab/field issues.
- Studied Rel18 DMRS (etype1/etype2) feature, integrated it into the system simulator (Csim) in channel estimation block to analyze gains and limitations, and enabled other teams to test it in their features.
- Developed an algorithm to optimize memory usage in channel estimation by implementing online downsampling on key parameter used in MMSE tap calculation
- Verified hardware changes and firmware instructions used in various channel estimation subblocks.
- Optimized noise estimation algorithm by minimizing signal leakage, enhancing overall signal to noise estimation improving channel estimation in some channel scenarios.

### Graduate Research and Teaching Assistant
Oklahoma State University (OSU), USA | **Jan 2017 – May 2021**
- Investigated visible light in wireless comm., detection and sensing systems ideas as: (Vehicle speed estimation, Human vitals estimation, Gesture recognition, Occupancy estimation, Bridge vibration analysis)
- Developed hardware prototypes for visible light comm. and sensing projects.
- Implemented a prototype for vitals monitoring based on visible light sensing.
- Participated in preparing proposals and patents applications for visible light sensing applications.
- Helped in preparing SDR lab session for Digital and Wireless communication courses.

### Modem System Engineer (Summer Intern)
Qualcomm Inc., San Diego, USA (Virtual) | **May – Aug. 2020**
- Optimized Volterra series parameters used in DPD without affecting the performance of the DPD.
- Utilized the Laguerre Expansion technique (LET) for DPD and PA modeling parameter space reduction.
- Compared LET with legacy algorithms in terms of complexity and performance.
- Tested different ANN designs for PA modeling.
- Won best project award in Qualcomm Interns Hackathon for developing a visible light sensing system to wirelessly control restaurant screens using sensors, enabling touchless interaction during COVID-19.

### Modem System Engineer (Summer Intern)
Qualcomm Inc., San Diego, USA | **May – Aug. 2019**
- Worked on online Digital Pre-Distortion (DPD) block to remove the power amplifier non-linearity.
- Developed and simulated different approaches to improve the legacy algorithms used in the system.
- Worked on new algorithm to minimize the complexity of the Digital Pre-Distortion (DPD) block using novel signal processing and machine learning techniques.

### Research and Teaching Assistant
Istanbul Sehir University, Turkey | **Sept. 2014 – Dec. 2016**
- Built a fading channel emulator for OFDM systems on MATLAB and LabVIEW.
- Verified the software USRP-based channel emulator with the theoretical limits.
- Participated in various other projects related to courses like implementing FFT algorithm in C++ and Automatic Modulation Classification based on KDE.

### System Design (DSP) Engineer
Wasiela (Varkon Semiconductors), Egypt | **Oct. 2013 – July 2014**
- Learned designing and development of OFDM systems using MATLAB and C++.
- Participated in LTE system Sub-blocks modelling.
- Developed fixed-point code and architecture of the LTE system physical layer sub-blocks.

## Selected Publications and Patents

1. H. Abuella and M. K. Ozdemir, ["Automatic Modulation Classification Based on Kernel Density Estimation,"](https://ieeexplore.ieee.org/document/7517452/) IEEE Canadian Journal of Electrical and Computer Engineering, vol. 39, no. 3, pp. 203-209, Summer 2016.
2. H. Abuella, F. Miramirkhani, S. Ekin, M. Uysal, and S. Ahmed ["ViLDAR – Visible Light Sensing Based Speed Estimation using Vehicle's Headlamps,"](https://ieeexplore.ieee.org/document/8839857/) in IEEE Transactions on Vehicular Technology, vol. 68, no.11, pp. 10406-10417, Nov. 2019.
3. H. Abuella and S. Ekin, ["Non-Contact Vital Signs Monitoring Through Visible Light Sensing,"](https://ieeexplore.ieee.org/document/8935383/) in IEEE Sensors Journal, vol. 20, no. 7, pp. 3859-3870, April, 2020.
4. H. Abuella, S. Ekin, M. Uysal "System and Method for Speed Estimation, Detection and Ranging using Visible Light in Vehicles", U.S. Patent No. 10,768,194 B2.
5. H. Abuella et al., ["Hybrid RF/VLC Systems: A Comprehensive Survey on Network Topologies, Performance Analyses, Applications, and Future Directions,"](https://ieeexplore.ieee.org/document/9618923/) in IEEE Access, vol. 9, pp. 160402-160436, 2021.

## Education

### Ph.D. at Oklahoma State University (OSU), USA
School of Electrical and Computer Engineering (GPA: 4.0/4.0) | **Jan. 2017 – May 2021**
**Thesis:** "Wireless Visible Light Sensing Systems: Applications, Opportunities, and Limitations"
**Advisor:** Assistant Prof. Sabit Ekin
**Courses:** Stochastic Processes, Wireless Communication, Linear Systems, Intelligent Systems.

### M.Sc. at Istanbul Sehir University, Turkey
Electronics and Computer Engineering Department (GPA: 3.95/4.0) | **Sept. 2014 – Dec. 2016**
**Thesis:** "Study on selected common wireless communication issues: Software channel emulators and Automatic Modulation Classification."
**Advisor:** Assistant Prof. Kemal Özdemir
**Courses:** DSP, Digital Communications, Estimation Theory, Machine Learning.

### Pre-Master at Ain-Shams University, Egypt
Communication and Electronics Eng. Department (GPA: 4.0/4.0) | **Sept. 2013 – June 2014**
**Courses:** DSP Intro., Advanced Math.

### B.Sc. at Ain-Shams University, Egypt
Communication Systems Engineering Program (GPA: 3.4/4.0) | **Sept. 2008 – June 2013**
**Thesis:** "Simulating ADHOC Cognitive Radio Network & MAC layer protocols."
**Courses:** Image Processing, Intro. to Machine Learning, Network Communication, Information Theory.

## Scholarships, Awards, and Grants

**Aug. 2017:** Acquired Research grant ($2,100) from Green Student Initiative (GSI) grant for a project: "A Focus on Enhancing Energy Conservation through Occupancy Estimation" from OSU Student Government Association (SGA).
**Nov. 2017:** Earned a Travel grant ($500) from GPSGA at OSU in USA.
**May 2018:** Awarded Dr. Rao Yarlagadda Graduate Fellowship ($1000) in Electrical & Computer Engineering for 2018/2019.
**Aug. 2020:** Awarded best hack in Qualcomm Interns Hackathon.
**Oct. 2026:** Awarded Best Cellular System Team Project in GenAI Hackathon.

## Activities

**Fall 2017:** Presented a Poster: (H. Abuella, S. Ekin, M. Uysal, and S. Ahmed, "Vehicle Sensing and Communications Using LED Headlamps for ITS," Oklahoma Transportation Research Day, Oct. 2017, Oklahoma City, OK).
**Fall 2017, 2018:** Participated in National Lab Day as a student volunteer (LiFi demo).
**Summer 2018:** Participated in preparing wireless and data communication new lab at OSU (CEAT Endeavor Labs).
**Fall 2018:** Presented a poster: (H. Abuella, S. Ekin, "Visible Light Communication and Sensing --Applications for Aerospace Industry--," Boeing Innovation Week, Nov. 2018, Oklahoma City, OK)
**Summer 2020:** Participated in Qualcomm PhD series to discuss my PhD research.
**Mar. 2026:** Helped organize the GenAI 101 workshops for the Cellular System team in San Diego and prepared some of the slides.

## Computer Skills

- **Basic Knowledge:** Linux bash, Assembly, Embedded C, Swift (Apple native app design)
- **Good Knowledge:** LabVIEW, NS2, Visio, LaTeX, GitHub, WebApps, Vibe Coding
- **Excellent Knowledge:** C/C++, Python, MATLAB, GenAI, Claude Code

## Languages

- **Native or bilingual proficiency:** Arabic
- **Professional working proficiency:** English
- **Basic Knowledge:** French, Turkish

## Personal Skills

- Efficient problem solver especially in hardware implementation issues.
- Quick learner and determined to improve myself.
- Not afraid to learn new topics or tools, or to explore new fields.
- Experienced researcher, with more than six years of research.
- Living in foreign countries and traveling experience (2+ years in Turkey and 9+ years in USA).

> References can be provided upon request
