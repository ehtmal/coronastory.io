var AUTO_RULES = AUTO_RULES || {};
AUTO_RULES["global"] = AUTO_RULES["global"] || {};
AUTO_RULES["global"]["realActive"] = AUTO_RULES["global"]["realActive"] || {}

/* English */
AUTO_RULES["global"]["realActive"]["en"] = [
  {id: "c00", block: false, duration: 2000, item: "active", message: "[FLAG] [LOCATION]", operator: "==", stop: false, title: "No more patient", value: 0},
  {id: "c0", block: false, duration: 1500, item: "active", message: "", operator: ">", stop: false, title: "First case at [FLAG]", value: 0},
  {id: "c10k", block: false, duration: 2000, item: "active", message: "", operator: ">=", stop: false, title: "Over 10.000 cases at [FLAG]", value: 10000},
  {id: "c100k", block: false, duration: 2500, item: "active", message: "", operator: ">=", stop: false, title: "Over 100.000 cases at [FLAG]", value: 100000},
  {id: "c500k", block: false, duration: 2500, item: "active", message: "", operator: ">=", stop: false, title: "Over 500.000 cases at [FLAG]", value: 500000},
  {id: "c1000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "Over 1 million cases at [FLAG]", value: 1000000},
  {id: "c2000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "Over 2 million cases at [FLAG]", value: 2000000},
  {id: "c3000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "Over 3 million cases at [FLAG]", value: 3000000},
  {id: "c4000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "Over 4 million cases at [FLAG]", value: 4000000},
  {id: "c5000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "Over 5 million cases at [FLAG]", value: 5000000},
  {id: "dar-pos", block: false, duration: 1500, item: "dailyActive", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "dar-neg", block: false, duration: 1500, item: "dailyActive", message: "", operator: "<=", stop: true, title: "[VALUE]", value: -10},
];
/* Vietnamese */
AUTO_RULES["global"]["realActive"]["vi"] = [
  {id: "c00", block: false, duration: 2000, item: "active", message: "[FLAG] [LOCATION]", operator: "==", stop: false, title: "Kh??ng c??n b???nh nh??n", value: 0},
  {id: "c0", block: false, duration: 1500, item: "active", message: "", operator: ">", stop: false, title: "Ca ?????u ti??n t???i [FLAG]", value: 0},
  {id: "c10k", block: false, duration: 2000, item: "active", message: "", operator: ">=", stop: false, title: "H??n 10.000 ca t???i [FLAG]", value: 10000},
  {id: "c100k", block: false, duration: 2500, item: "active", message: "", operator: ">=", stop: false, title: "H??n 100.000 ca t???i [FLAG]", value: 100000},
  {id: "c500k", block: false, duration: 2500, item: "active", message: "", operator: ">=", stop: false, title: "H??n 500.000 ca t???i [FLAG]", value: 500000},
  {id: "c1000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "H??n 1 tri???u ca t???i [FLAG]", value: 1000000},
  {id: "c2000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "H??n 2 tri???u ca t???i [FLAG]", value: 2000000},
  {id: "c3000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "H??n 3 tri???u ca t???i [FLAG]", value: 3000000},
  {id: "c4000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "H??n 4 tri???u ca t???i [FLAG]", value: 4000000},
  {id: "c5000k", block: false, duration: 3000, item: "active", message: "", operator: ">=", stop: false, title: "H??n 5 tri???u ca t???i [FLAG]", value: 5000000},
  {id: "dar-pos", block: false, duration: 1500, item: "dailyActive", message: "", operator: ">=", stop: true, title: "+[VALUE]", value: 100},
  {id: "dar-neg", block: false, duration: 1500, item: "dailyActive", message: "", operator: "<=", stop: true, title: "[VALUE]", value: -10},
];