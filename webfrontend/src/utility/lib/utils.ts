import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getLabels = (initialData:any, timeframe: string, requestTimeFrame:string) => {
  const fetchedTime = initialData[0][requestTimeFrame]
  const labels: String[] = []

const getDayLabels = () => {
  fetchedTime.map((timeSet: any)=> {
    let date = new Date (timeSet.x)
    const day = date.toLocaleString('en-US', { day: "numeric" }).slice(0,3)
    const month = date.toLocaleString('en-US', { month: "short" }).slice(0,3)
    const dayLabel = `${day} ${month} `
    if(!labels.includes(dayLabel)){
      labels.push(dayLabel)
    }
  })
}

const getHourLabels = () => {
 fetchedTime.map((timeSet:any)=> {
  let date = new Date (timeSet.x)
  let hour = date.toLocaleString('en-US', {hour:"numeric"}).slice(0,5)
  if(!labels.includes(hour) && timeframe != "3 days" ){
    labels.push(`${hour}`);
  }
 })
}

const getMinuteLabels = ()=> {
  fetchedTime.map((timeSet:any)=> {
    let date = new Date (timeSet.x)
    let hour = date.toLocaleString('en-US', {hour:"2-digit"}).slice(0,2).padStart(2, "0");
    let minute = date.toLocaleString('en-US', {minute:"2-digit"}).padStart(2, "0");
    let hourMinute = `${hour}:${minute} `
    if(!labels.includes(hourMinute)){
      labels.push(hourMinute);
    }
   })
}

const getMonthLabels =() => {
  fetchedTime.map((timeSet:any)=> {
    let date = new Date (timeSet.x)
    const day = date.toLocaleString('en-US', { day: "numeric" }).slice(0,3)
    const month = date.toLocaleString('en-US', { month: "short" }).slice(0,3)
    const dayLabel = `${day} ${month} `
    if(!labels.includes(dayLabel)){
      const everyThirdDay = Number(day) % 3 
      if(everyThirdDay == 0 ) {
        labels.push(dayLabel)
      }
    }
  })
}

const getThreeMonthLabel = () => {
  fetchedTime.map((timeSet:any)=> {
    let date = new Date (timeSet.x)
    const day = date.toLocaleString('en-US', { day: "numeric" }).slice(0,3)
    const month = date.toLocaleString('en-US', { month: "short" }).slice(0,3)
    const dayLabel = `${day} ${month} `
    if(!labels.includes(dayLabel)) {
    
    }
  })
}

const getSixMonthLabel = ()=> {
  fetchedTime.map((timeSet:any)=> {
    let date = new Date (timeSet.x)
    let month = date.toLocaleString('en-US', {month:"short"}).slice(0,5)
    if(!labels.includes(month) && timeframe != "3 days" ){
      labels.push(`${month}`);
    }
   })
}

const getFiveYearLabel = ()=> {
  fetchedTime.map((timeSet:any)=> {
    let date = new Date (timeSet.x)
    let year = date.toLocaleString('en-US', {year:"numeric"}).slice(0,5)
    if(!labels.includes(year) && timeframe != "3 days" ){
      labels.push(`${year}`);
    }
   })
}



if(timeframe == "7 days"){
  getDayLabels()
  return labels.reverse()
} else if (timeframe === "1 day" || timeframe === "12 hours"){
  getHourLabels()
  return labels
} else if (timeframe === "1 hour"){
  getMinuteLabels()
  return labels
} else if (timeframe === "4 hours"){
  getMinuteLabels()
  return labels
} else if (timeframe === "1 month"){
  getMonthLabels()
  return labels
} else if (timeframe === "3 months"){
  getThreeMonthLabel()
  console.log("This are the labels", labels)
} else if (timeframe === "6 months"){
  getSixMonthLabel() 
  return labels
} else if (timeframe === "5 years"){
  getFiveYearLabel()
  return labels
}
}

export const getTimeFrame = (initialData: any, timeframe:string, requestTimeFrame: string) => {
  const fetchedTime = initialData[0][requestTimeFrame];
  const lastTimeFrame =  fetchedTime[fetchedTime.length -1].x; 
  let date = new Date();
  const labels: String[] = [];
  const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

 const getDayLabels = (daysFrame:number) => {
  const dayDate = date.getDate()
  const monthDate = date.getMonth()

  for(let days= 0; days <= daysFrame; days++){
    const day = dayDate - days
   if(day <= 0 && monthDate > 0){
      
  const lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
  const newMonthDate= lastDayOfLastMonth.getDate()+ day
  labels.push(`${newMonthDate} ${months[monthDate-1]}`)
   }  else if (monthDate < 0 || day <= 0) {
  const lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
  const newMonthDate = lastDayOfLastMonth.getDate() + day
  labels.push(`${newMonthDate} Dec`)
  } else {
      labels.push(`${day} ${months[monthDate]}`)
  }
}
}


 const getHourLabels = (hourFrame: number ) => {
  const lastHour = date.getHours()
  for(let hour = 0; hour <= hourFrame; hour++){
    let hours = (lastHour - hour + 24) % 24;
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    labels.push(`${hours} ${period}`);
  }
 }

  if (timeframe == "12 hours"){
  getHourLabels(11)
  }else if(timeframe == "1 day"){
  getHourLabels(23)
  }else if (timeframe === "3 days"){
  getDayLabels(3)
  }else if (timeframe === "7 days") {
  getDayLabels(7)
  }else if(timeframe === "1 month" ) {
  } else if (timeframe === "3 months") {
  }
  return labels;
};