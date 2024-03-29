var AUTO_RULES = AUTO_RULES || {};
AUTO_RULES["global"] = AUTO_RULES["global"] || {};
AUTO_RULES["global"]["realAll"] = AUTO_RULES["global"]["realAll"] || {}

/* English */
AUTO_RULES["global"]["realAll"]["en"] = [
  {id: "c0", block: false, duration: 1500, item: "confirmed", message: "", operator: ">", stop: false, title: "First case at [FLAG]", value: 0},
  {id: "c10k", block: false, duration: 2000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 10.000 cases at [FLAG]", value: 10000},
  {id: "c100k", block: false, duration: 2500, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 100.000 cases at [FLAG]", value: 100000},
  {id: "c500k", block: false, duration: 2500, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 500.000 cases at [FLAG]", value: 500000},
  {id: "c1000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 1 million cases at [FLAG]", value: 1000000},
  {id: "c2000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 2 million cases at [FLAG]", value: 2000000},
  {id: "c3000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 3 million cases at [FLAG]", value: 3000000},
  {id: "c4000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 4 million cases at [FLAG]", value: 4000000},
  {id: "c5000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Over 5 million cases at [FLAG]", value: 5000000},
  {id: "d0", block: false, duration: 1500, item: "deaths", message: "", operator: ">", stop: false, title: "First case at [FLAG]", value: 0},
  {id: "dcr", block: false, duration: 1500, item: "dailyConfirmed", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "drr", block: false, duration: 1500, item: "dailyRecovered", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "ddr", block: false, duration: 1500, item: "dailyDeaths", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
];
/* Vietnamese */
AUTO_RULES["global"]["realAll"]["vi"] = [
  {id: "c0", block: false, duration: 1500, item: "confirmed", message: "", operator: ">", stop: false, title: "Ca nhiễm đầu tiên tại [FLAG]", value: 0},
  {id: "c10k", block: false, duration: 2000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 10.000 ca tại [FLAG]", value: 10000},
  {id: "c100k", block: false, duration: 2500, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 100.000 ca tại [FLAG]", value: 100000},
  {id: "c500k", block: false, duration: 2500, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 500.000 ca tại [FLAG]", value: 500000},
  {id: "c1000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 1 triệu ca tại [FLAG]", value: 1000000},
  {id: "c2000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 2 triệu ca tại [FLAG]", value: 2000000},
  {id: "c3000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 3 triệu ca tại [FLAG]", value: 3000000},
  {id: "c4000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 4 triệu ca tại [FLAG]", value: 4000000},
  {id: "c5000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "Hơn 5 triệu ca tại [FLAG]", value: 5000000},
  {id: "d0", block: false, duration: 1500, item: "deaths", message: "", operator: ">", stop: false, title: "Trường hợp đầu tiên tử vong [FLAG]", value: 0},
  {id: "dcr", block: false, duration: 1500, item: "dailyConfirmed", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "drr", block: false, duration: 1500, item: "dailyRecovered", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "ddr", block: false, duration: 1500, item: "dailyDeaths", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
];