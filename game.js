(function ($) {
	var isWinner = function( cBoard ) {
		if( cBoard.find("img:visible").length == 1) return true;
		else return false;
	}

	var canMove = function( cBoard ) {
	    var pegs = cBoard.find("img:visible"),
        moves = 0;
		if( pegs && pegs.length > 1) {
			$.each( pegs , function() {
				var peg_cell = $(this).parent();
				var selx = parseInt(peg_cell.attr("data-x")),
					sely = parseInt(peg_cell.attr("data-y")),
					checkx = "",
					checky = "",
					check = "";
				
				/* x moves */
				checkx = selx-2;
				checky = sely;
				check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
				if( check.length == 1 && check.find("img:visible").length == 0 ){
					checkx = selx-1;
					check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
					if( check.length == 1 && check.find("img:visible").length == 1 ){
						moves++;
					}
				}
				checkx = selx+2;
				check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
				if( check.length == 1 && check.find("img:visible").length == 0 ){
					checkx = selx+1;
					check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
					if( check.length == 1 && check.find("img:visible").length == 1 ){
						moves++;
					}
				}
				/* y moves */
				checkx = selx;
				checky = sely-2;
				check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
				if( check.length == 1 && check.find("img:visible").length == 0 ){
					checky = sely-1;
					check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
					if( check.length == 1 && check.find("img:visible").length == 1 ){
						moves++;
					}
				}
				checky = sely+2;
				check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
				if( check.length == 1 && check.find("img:visible").length == 0 ){
					checky = sely+1;
					check = cBoard.find("td[data-x='"+checkx+"'][data-y='"+checky+"']");
					if( check.length == 1 && check.find("img:visible").length == 1 ){
						moves++;
					}
				}
				
			});
		}else{
			return false;
		}
		if( moves == 0) return false;
		else return true;
	}
	
	var methods = {
		init : function( options ) { 
			var settings = {
			  'gameCSS': 'game.css',
			  'pegImg': 'peg.png',
			  'onWin': function() { alert("You win!!!"); },
			  'onNoMoves': function() { alert("No moves"); }
			};
			
			return this.each(function(){
				
				var $this = $(this);
				if ( options ) { 
					$.extend( settings, options );
				}
				$('head').append('<link rel="stylesheet" href="'+settings.gameCSS+'" type="text/css" />');
				var board = $("<table class='board-table' />");
				
				for(var i = 3; i >= -3; i--) {
					var row = $("<tr />");
					for(var j = -3; j <= 3; j++) {
						var xy = String(Math.abs(j))+String(Math.abs(i));
						if( $.inArray( xy, ["33","23", "32", "22"] ) > -1 ) {
							row.append($('<td data-x="'+j+'" data-y="'+i+'" class="no-cell"></td>'));
						} else if( i === 0 && j === 0 ) {
							row.append($('<td data-x="'+j+'" data-y="'+i+'"><img style="display:none" src="'+settings.pegImg+'"></td>'));
						} else {
							row.append($('<td data-x="'+j+'" data-y="'+i+'"><img src="'+settings.pegImg+'"></td>'));
						}
					}
					board.append(row);
				}
				$this.append(board);
				$this.addClass("board-table-parent");
				$this.data("pegBoard", "peg-board");   
				var cBoard = $this.find("table"),
					cells = cBoard.find("td:not(.no-cell)");
					
				cBoard.find("td:not(.no-cell)").click( function(  ) {
					cell = $(this);
					cellPeg = cell.find("img:visible");
					if( cell.hasClass("selected") ) {
						cell.removeClass("selected");
						$.removeData(cBoard, "sel");
					} else {
						if( $.hasData(cBoard) ) {
							var oldSel = $.data(cBoard, "sel");
							if( cellPeg.length == 0 ) {
								var selx = parseInt(oldSel.attr("data-x")),
									sely = parseInt(oldSel.attr("data-y")),
									nowx = parseInt(cell.attr("data-x")),
									nowy = parseInt(cell.attr("data-y")),
									middle = "",
									midy = "",
									midx = "",
									move = false;
								
								if( selx == nowx && (sely == nowy+2 || sely == nowy-2)) {
									if( sely > nowy ) {
										midy = parseInt(sely)-1;
									} else {
										midy = parseInt(sely)+1;
									}
									middle = cBoard.find("td[data-x='"+selx+"'][data-y='"+midy+"']").find("img:visible");
									if( ( midy != nowy) && (middle.length == 1) ) {
										middle.hide();
										oldSel.find("img").hide();
										cell.find("img").show();
										move = true;
											
									}
									oldSel.removeClass("selected");		
									$.removeData(cBoard, "sel");						
								} else if( sely == nowy && (selx == nowx+2 || selx == nowx-2)) {
									if( selx > nowx ) {
										midx = parseInt(selx)-1;
									} else {
										midx = parseInt(selx)+1;
									}
									middle = cBoard.find("td[data-x='"+midx+"'][data-y='"+sely+"']").find("img:visible");
									if( ( midx != nowx) && (middle.length == 1) ) {
										middle.hide();
										oldSel.find("img").hide();
										cell.find("img").show();
										move = true;	
									}
									oldSel.removeClass("selected");		
									$.removeData(cBoard, "sel");
								} else {
									
									oldSel.removeClass("selected");
									$.removeData(cBoard, "sel");
								}
								
								if( move ) {
									if( isWinner( cBoard ) ){
										settings.onWin( cBoard );
									} else if( !canMove( cBoard )) {
										settings.onNoMoves( cBoard );
									}
									
								}
							}else{
								oldSel.removeClass("selected");
								cell.addClass("selected");
								$.removeData(cBoard, "sel");
								$.data(cBoard, "sel", cell);   
							}
						}else{
							if( cellPeg.length == 1 ) { 
								cell.addClass("selected");
								$.removeData(cBoard, "sel");
								$.data(cBoard, "sel", cell);
							}	
						}
					}
					
				});
			})
		},
		reset : function( ) { 
			
			return this.each(function(){
			
				var $this = $(this),
					data = $this.data('pegBoard');
				if( data ) {
					var cBoard = $this.find("table");
					$.removeData(cBoard, "sel");
					cBoard.find("td:not(.no-cell)").removeClass("selected").find("img").show();
					cBoard.find("td[data-x='0'][data-y='0']").find("img").hide();
				}

			})
		},
		destroy : function( ) { 
			return this.each(function(){

				var $this = $(this),
					 data = $this.data('pegBoard');
				console.log(data);
				if( data ) {
					$(window).unbind('.pegBoard');
					$this.removeData('pegBoard');
					$this.html("");
					$this.removeClass("board-table-parent");
				}
			})
		} 
	};       
	$.fn.pegBoard = function( method ) {      
			if ( methods[method] ) {
			  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
			  return methods.init.apply( this, arguments );
			} else {
			  $.error( 'Method ' +  method + ' does not exist on jQuery.pegBoard' );
			}
	};
})(jQuery);