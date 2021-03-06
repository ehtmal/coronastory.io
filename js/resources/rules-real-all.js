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
  {id: "c0", block: false, duration: 1500, item: "confirmed", message: "", operator: ">", stop: false, title: "Ca nhi???m ?????u ti??n t???i [FLAG]", value: 0},
  {id: "c10k", block: false, duration: 2000, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 10.000 ca t???i [FLAG]", value: 10000},
  {id: "c100k", block: false, duration: 2500, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 100.000 ca t???i [FLAG]", value: 100000},
  {id: "c500k", block: false, duration: 2500, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 500.000 ca t???i [FLAG]", value: 500000},
  {id: "c1000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 1 tri???u ca t???i [FLAG]", value: 1000000},
  {id: "c2000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 2 tri???u ca t???i [FLAG]", value: 2000000},
  {id: "c3000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 3 tri???u ca t???i [FLAG]", value: 3000000},
  {id: "c4000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 4 tri???u ca t???i [FLAG]", value: 4000000},
  {id: "c5000k", block: false, duration: 3000, item: "confirmed", message: "", operator: ">=", stop: false, title: "H??n 5 tri???u ca t???i [FLAG]", value: 5000000},
  {id: "d0", block: false, duration: 1500, item: "deaths", message: "", operator: ">", stop: false, title: "Tr?????ng h???p ?????u ti??n t??? vong [FLAG]", value: 0},
  {id: "dcr", block: false, duration: 1500, item: "dailyConfirmed", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "drr", block: false, duration: 1500, item: "dailyRecovered", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "ddr", block: false, duration: 1500, item: "dailyDeaths", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
];