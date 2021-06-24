var pauseTimer1 = pauseTimer2 = pauseTimer3 = false; 
var runTime1, runTime2, runTime3; //each timer's run time instance
let isAppliedSetting = false;
let currentTabId = 1

document.addEventListener('DOMContentLoaded', () => {
  bindAll();
  setTimers();
});
const bindAll = () => {
  //bind tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', onClickTab);
  })
  //bind setting button & setting board close button
  document
    .querySelectorAll('.setting-btn, .setting-board-close-btn')
    .forEach(btn => btn.addEventListener('click', toggleSettingBoard));
  //bind setting colour options
  document
    .querySelectorAll('.setting-colour1, .setting-colour2, .setting-colour3')
    .forEach(btn => btn.addEventListener('click', onSelectColour));
  //bind setting apply button
  document
    .querySelector('.setting-board-apply-btn')
    .addEventListener('click', onClickSettingApplyBtn);
  //bind tab content (timer)
  document
    .querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.addEventListener('click', onClickTimer);
    })
}
const setTimers = () => {
  let timers = document.querySelectorAll(`#tab1-timer-time, #tab2-timer-time, #tab3-timer-time`)
  timers.forEach((timer, i) => localStorage.setItem(`tab${++i}Time`, timer.innerHTML))
}
const runTimer = (duration, timeElement)=>{
  executeTime(duration, timeElement, currentTabId)
}
const executeTime = (duration, timeElement, runTimeId)=>{
  let countdown = duration, minutes, seconds;

  window[`runTime${runTimeId}`] = setInterval(()=> {
    minutes = parseInt(countdown / 60, 10);
    seconds = parseInt(countdown % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timeElement.innerHTML = minutes + ":" + seconds;
    if (--countdown < 0) {
      clearInterval(window[`runTime${runTimeId}`]);
      document.getElementById(`tab${runTimeId}-timer-status`).innerText = "restart"
    }
    localStorage.setItem(`tab${runTimeId}Time`, minutes + ":" + seconds)
    if(window[`pauseTimer${runTimeId}`]) {
      clearInterval(window[`runTime${runTimeId}`]);
    }
  }, 1000);

}
const a = (countdown, duration, miuntes, seconds)=>{

}
const restartTimer = (duration,timeElement)=>{
  startTimer(duration,timeElement)
}
const startTimer = (duration, timeElement) => {
  duration = 60 * duration
  runTimer(duration, timeElement);
}
const getCurrentTimeMinute = (timeElement)=>{
  const timeVal = timeElement.innerHTML;
  const timeMin = timeVal.substr(0,timeVal.indexOf(":"))
  return timeMin;
}

const onClickTimer = ()=>{
  let timerStatus = document.getElementById(`tab${currentTabId}-timer-status`)
  const timeElement= document.getElementById(`tab${currentTabId}-timer-time`)
  const time = localStorage.getItem(`tab${currentTabId}Time`)
  const splitTimeVal = time.split(':') 
  const minute = splitTimeVal[0]
  const seconds = splitTimeVal[1]
  switch (timerStatus.innerText) {
    case "start":
      window[`pauseTimer${currentTabId}`]  = false;
      startTimer(minute,timeElement)
      timerStatus.innerText = 'pause'
      break;
    case "pause":
      window[`pauseTimer${currentTabId}`] = true;
      timerStatus.innerText = 'resume' 
      break;
    case "resume":
      window[`pauseTimer${currentTabId}`] = false;
      timerStatus.innerText = 'pause' 
      const duration = minute < 1? seconds : (minute * 60) + + seconds
      runTimer(duration, timeElement)
      break;
    case "restart":
      restartTimer(minute,timeElement);
      timerStatus.innerText = 'pause'
      break;
  }
}

const getCurrentSettingColourOption = () =>{
  let currrentColourOptionNumber = 0;
  let foundCurrentColourOptionNumber = false
  const colourOptions = document.querySelectorAll('.setting-colour-tick')
  colourOptions.forEach(colourOption => {
    if(!foundCurrentColourOptionNumber) currrentColourOptionNumber++;
    const colourOptionClassHidden = colourOption.classList[1]
    if(colourOptionClassHidden === undefined && colourOptionClassHidden !== 'hidden'){
      foundCurrentColourOptionNumber = true
    }
  })
  return currrentColourOptionNumber;
}
const onClickSettingApplyBtn = () => {
  const timerInput = document.getElementById(`setting-timer-input${currentTabId}`)
  if(timerInput.value) applyTimerTime();
  applyTimerColour();
}
const applyTimerTime =  () => {
    isAppliedSetting = true;
    for (let i = 1; i <= 3; i++) {
      const timerInput = document.getElementById(`setting-timer-input${i}`).value
      window[`pauseTimer${i}`]= true;
      if(timerInput.trim() != ''){
        
        const currentTime = document.getElementById(`tab${i}-timer-time`)
        const time = timerInput < 10 
                    ? "0"+ timerInput + ":00" 
                    : timerInput+":00";
        localStorage.setItem(`tab${i}Time`,time)
        currentTime.innerHTML = time;
        document.getElementById(`tab${i}-timer-status`).innerText = 'start'
      }
    }
    isAppliedSetting = false;
}
const applyTimerColour = () => {
  const currrentColourOptionNumber = getCurrentSettingColourOption(); 
  let tabContents= document.querySelectorAll('.tab-content')
  //change timer (tab-content) border colour
  switch (currrentColourOptionNumber) {
    case 1:
      tabContents.forEach(content => {
        content.classList.remove('border-colour-green1','border-colour-pink1')
        content.classList.add('border-colour-red1')
      })
      break;
    case 2:
      tabContents.forEach(content => {
        content.classList.remove('border-colour-red1','border-colour-pink1')
        content.classList.add('border-colour-green1')
      })
      break;
    case 3:
      tabContents.forEach(content => {
        content.classList.remove('border-colour-red1','border-colour-green1')
        content.classList.add('border-colour-pink1')
      })
      break;
  }
}
const onSelectColour = ({target}) =>{
  const currrentColourOptionNumber = target.id.slice(-1)[0]
  // get all colour ticks and hide them and show the tick of the selected colour
  document.querySelectorAll('.setting-colour-tick').forEach(tick  => {
    const tickId =  tick.id.slice(-1)[0];
    currrentColourOptionNumber != tickId 
      ? tick.classList.add('hidden')
      :tick.classList.remove('hidden');
  });
}

const onClickTab = ({ target }) => {
  const { dataset: { id = '' }} = target;
  // get all tabs and unselect each tab. Then add effect to the selected tab
  document.querySelectorAll('.tab').forEach(tab  => tab.classList.remove('tab-selected', 'red-1'));
  target.classList.add('tab-selected', 'red-1');

  // get and hide all tabs' content. Then show the content of the selected tab
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add(['hidden']));
  document.querySelector(`#${id}`).classList.remove(['hidden']);
  currentTabId = id.slice(-1)[0]
};

const toggleSettingBoard = ({})=>{
  for (let i = 1; i <= 3; i++) {
    window[`pauseTimer${i}`] = true;
    let timerStatus = document.getElementById(`tab${i}-timer-status`);
    timerStatus.innerText = 'resume'
  }

  let settingBoard = document.querySelector('.setting-board')
  toggleClassEffect(settingBoard, ["hidden"])
  let settingBoardBtn = document.querySelector('.setting-btn')
  toggleClassEffect(settingBoardBtn, ['spinning'])
}

const toggleClassEffect = (target, classNames) => {
  if(target.classList.contains(...classNames)) target.classList.remove(...classNames)
  else target.classList.add(...classNames)
}

