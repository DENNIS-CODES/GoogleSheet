function submitOrders() {

    // 1. Get Orders from the excel document
    let order_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[3];

    let _asset =  order_sheet.getRange(`D13`).getValue().toString();
    let _orderType =  order_sheet.getRange(`D11`).getValue().toString();

    let _orders = [];

    for (let i=17;i<=28; i++) {
      let _order = order_sheet.getRange(`C${i}:G${i}`).getValues()[0]
      if(_order[4].toLowerCase().trim().includes('y')) {
        _orders.push(
          {
        side: _orderType.toLowerCase().trim().includes('short') ?"Sell" : "Buy",
        symbol: _asset.toUpperCase(),
        price: _order[2],
        trigger_price: _order[3],
        quantity: _order[1],
        order_type: _orderType.toLowerCase(),
        track: true,
        is_placed: false
        }

        )
      }
    }

  // 2 Push the orders to sauna server which then pushes to db

  let url = 'http://45.63.66.218/tradingviewbot/api/v1/googlesheet';
  for (const _order of _orders) {
    UrlFetchApp.fetch(
      url,
      {
        method: "POST",
         headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(_order)
      }
    )
  }
