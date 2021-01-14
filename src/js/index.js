$(function(){

  $('.market-options').hide();

  var $items = $('#item-list');

  $.getJSON('https://raw.githubusercontent.com/maisans-maid/Mai/master/assets/json/market.json', function(data, status){

    $.each(data, function(_, item){
      $items.append(`
        <article class="item ${item.type}" sort-id="${parseInt(item.id)}" sort-price="${item.price}" sort-name="${item.name}">
          <h3>${item.name}</h3>
          <div class="item-price"> Price: ${item.price || 'FREE'}</div>
          <div class="preview">
            <img src="${item.assets.link}" class="image-${item.type}">
            <div class="overlay">
              <div class="overlay-text">
              <p> ${item.description} </p>
              <p> To buy: m!buy ${item.id} </p>
              <p> To equip: m!equip ${item.id} </p>
              </div>
            </div>
          </div>
          <div class="item-tags">
            <div class="item-tags-type" item-type="${item.type}"> Type: ${item.type} </div>
            <div class="item-tags-${item.deletable ? 'deletable' : 'not-deletable'}"> ${item.deletable ? '' : 'Not'} Deletable </div>
            <div class="item-tags-${item.giftable ? 'giftable' : 'not-giftable'}"> ${item.giftable ? '' : 'Not'} Giftable </div>
          </div>
        </article>
      `)
    });

    $items.append(`
      <article class="empty-child"></article>
      <article class="empty-child"></article>
      <article class="empty-child"></article>
    `);

    // type is which type to show, action could be none, next, prev, or a page number
    function paginate(type, action, currentPage){

      if (type === 'all'){
        type = undefined;
      };

      const items = $(`.item${type?'.'+type:''}`);
      const itemlength = items.length;
      const itemsperpage = 16;
      const totalpages = Math.ceil(itemlength / itemsperpage);

        // create page chunks
        const pagechunks = [[]];
        let pagechunkindex = 0;

        items.each(function(){
          if (pagechunks[pagechunkindex].length >= itemsperpage){
            pagechunks.push([]);
            pagechunkindex++;
          };
          pagechunks[pagechunkindex].push(this);
        })

        //  Get the current page chunk
        var currentPagechunk = currentPage - 1;
        var expectedPagechunk;

        // Hide all elements
        $('.item').hide();

        if (!action){
          expectedPagechunk = 0;
          $.each(pagechunks[expectedPagechunk], function(_, item){
            $(item).show();
          });
        } else if (!action || action === 'next'){
          expectedPagechunk = pagechunks[currentPagechunk+1] ? currentPagechunk+1 : 0
          $.each(pagechunks[expectedPagechunk] || pagechunks[0], function(_, item){
            $(item).show();
          });
        } else if (action === 'prev'){
          expectedPagechunk = pagechunks[currentPagechunk-1] ? currentPagechunk-1 : pagechunks.length - 1;
          $.each(pagechunks[expectedPagechunk] || pagechunks[expectedPagechunk], function(_, item){
            $(item).show();
          });
        } else if (!isNaN(action)){
          expectedPagechunk = Number(action) - 1;
          $.each(pagechunks[expectedPagechunk], function(_, item){
            $(item).show();
          });
        };


        // Register to paginator
        const contentpagenums = [];

        $.each(pagechunks, function(index){
          if (expectedPagechunk === index){
            contentpagenums.push(`<li class="pagination-button active" page-no="${index+1}">${index+1}</li>`);
          } else {
            contentpagenums.push(`<li class="pagination-button" page-no="${index+1}">${index + 1}</li>`)
          }
        });

        const newContent =
        `<ul class="pageinfo">
             <li class="pagination-button" page-no="prev"> << </li>
             ${contentpagenums.join('').replace(/\.{1,}/g,'<li class="dots">...</li>')}
             <li class="pagination-button" page-no="next"> >> </li>
         </ul>
        `;

        const paginator = $('.paginator');
        paginator.empty();
        paginator.append(newContent);

        $('body,html').animate({scrollTop:$('.main').offset().top},500)

        // Return the current page number and  the total page number
        return {
          currentPage: currentPagechunk + 1,
          totalPage: pagechunks.length
        };
      };

    paginate();
  });
});
