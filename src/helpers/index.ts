import { formatDistance } from "date-fns";

export function capitalizeName(fullName: string): string {
  const names: string[] = fullName.split(" ");

  const capitalFirstName = names[0].charAt(0).toUpperCase() + names[0].slice(1)
  const capitalLastName = names[1].charAt(0).toUpperCase() + names[1].slice(1)

  return `${capitalFirstName} ${capitalLastName}`
}


export function formatDate(date: Date, lang: string = 'en'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(lang, options);
}

export function formatDateHHMM(date: Date, lang: string = 'en'): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };

  return date.toLocaleTimeString(lang, options).slice(0, 5);
}


export const formatedDistance = (timestamp: any) => {
  let opinionDate = new Date(timestamp);
  return formatDistance(opinionDate, new Date(Date.now()), {
    addSuffix: true,
  });
};


export const getInitialTopics = () => {
  let headlines = [
    "General",
    "Flag_March",
    "Gaza_Protests",
    "Jerusalem_Shutdown",
    "Haifa_Homes",
    "Hebrew_Bible",
    "Flag_Day",
    "UN_Suspension",
    "Judicial_Overhaul",
    "Gaza_Strip",
    "West_Bank",
    "Climate_Change",
    "Income_Inequality",
    "Global_Power_Dynamics"
  ];
  return headlines.map(
    (topic) => {
      return {
        value: topic,
        label: topic,
      };
    }
  );

}


