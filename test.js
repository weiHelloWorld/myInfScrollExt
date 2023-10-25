async function reddenPage() {
  console.log('here');
  function get_next_page_link(doc) {
    next_page_url_list = doc.getElementsByClassName("no pg-next");
    console.log("next_page_url_list.length = " + next_page_url_list.length);
    if (next_page_url_list.length == 0) {
      tmp_url = "";
    }
    else {
      tmp_url = next_page_url_list[0].firstChild['href'];
    }
    return tmp_url;
  }
  const MAX_PAGE = 50;
  for (let kk = 0; kk < MAX_PAGE; kk++) {
    tmp_url = get_next_page_link(document);
    console.log("url = " + tmp_url);
    if (tmp_url.length > 0 && tmp_url != window.location.href) {
      const response = await fetch(tmp_url, {});
      // console.log(response);
      tmp_res = await response.text();
      // console.log(tmp_res);
      var parser = new DOMParser();
      var doc_new = parser.parseFromString(tmp_res, "text/html");
      contentContainer = document.getElementsByClassName("post-list")[0];
      var posts_next_list = doc_new.getElementsByClassName("post-item");
      for (let ii = 0; ii < posts_next_list.length; ii++) {
        // console.log("ii = " + ii + ", posts_next_list.length = " + posts_next_list.length);
        const item_post = posts_next_list[ii];
        contentContainer.appendChild(item_post.cloneNode(true));
      }
      document.getElementsByClassName("no pg-next")[0].firstChild['href'] = get_next_page_link(doc_new);  // set new next page link
      console.log(doc_new.getElementsByClassName("no pg-next")[0]);
    }
    else {
      break;
    }
  }
}
  
browser.browserAction.onClicked.addListener((tab) => {
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: reddenPage
  })
  browser.scripting.insertCSS({target: {
      tabId: tab.id,
    },
    css: `.post-item .left-section {
      display:table-cell;
      width:1px;
      height:150%;
      background:#fafafa;
      z-index:1;
      box-sizing:content-box;
      display: none;
      border-right:1px solid #c2d5e3
    }
    .post-item .right-section{
      position:relative;display:table-cell;vertical-align:top;min-height:10px;background:#fff;padding-bottom:5px
    }
    .post-item{position:relative;color:#444;min-height:10px;background:#e5edf2;padding:5px 0}
    `
  })
});
