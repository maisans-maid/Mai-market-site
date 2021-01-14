$(document).ready(function(){
  $(".nav-btn").click(function(){
    $('.market-options').hide(300);

    var attr = $(this).attr('data-li');

    $('.nav-btn').removeClass('active');
    $(this).addClass('active');

    $('.item').hide();

    paginate(attr);
  });

  $(document).on('click',  '.pagination-button', function(){
    $('.market-options').hide(300);

    const pagenumber = $(this).attr('page-no');
    var activetype = $('.nav-btn.active').attr('data-li');
    var currentPage = $('.pagination-button.active').attr('page-no');

    if ($(this).hasClass('active')){
      return;
    } else {
      $('.pagination-button').removeClass('active');
      $(this).addClass('active');
      paginate(activetype, pagenumber, currentPage);
    };
  });

  $('.gear-icon').click(function(){
    $('.market-options').toggle(300);
  });

  $('.market-options').click(function(){
    $('.market-options').hide(300);

    // remove the empty child elements
    $('.empty-child').remove();

    const attr = $(this).attr('sort');

    if (attr === 'id'){
      $('.item').sort(function(a,b){
        var contentA =parseInt( $(a).attr('sort-id'));
        var contentB =parseInt( $(b).attr('sort-id'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
      }).appendTo('.items');
    } else if (attr === 'id-dec'){
      $('.item').sort(function(a,b){
        var contentA =parseInt( $(a).attr('sort-id'));
        var contentB =parseInt( $(b).attr('sort-id'));
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
      }).appendTo('.items');
    } else if (attr === 'price'){
      $('.item').sort(function(a,b){
        var contentA =parseInt( $(a).attr('sort-price'));
        var contentB =parseInt( $(b).attr('sort-price'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
      }).appendTo('.items');
    } else if (attr === 'price-dec'){
      $('.item').sort(function(a,b){
        var contentA =parseInt( $(a).attr('sort-price'));
        var contentB =parseInt( $(b).attr('sort-price'));
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
      }).appendTo('.items');
    } else if (attr === 'name'){
      $('.item').sort(function(a,b){
        var contentA = $(a).attr('sort-name');
        var contentB = $(b).attr('sort-name');
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
      }).appendTo('.items');
    } else if (attr === 'name-dec'){
      $('.item').sort(function(a,b){
        var contentA = $(a).attr('sort-name');
        var contentB = $(b).attr('sort-name');
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
      }).appendTo('.items');
    }

    // append the empty child elements again
    $('.items').append(`
      <article class="empty-child"></article>
      <article class="empty-child"></article>
      <article class="empty-child"></article>
    `);
  })
});

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
