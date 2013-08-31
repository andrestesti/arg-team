
var timerID = 0;
var imgArray = new Array( -1, -1, -1, -1, -1, -1, -1, -1, -1 );

var locale = "es_ES";

var mainText = null;

var popupServiciosProductosTimer = null;


$(document).ready( function() {

    mainText = $("#main-text");

    $("img").click( function( event ) {
        event.preventDefault();
        $(this).fadeOut( "slow" );
        $(this).fadeIn( "slow" );
    });

    $("#es_ES").click( function() {
        $("#contents *").stop().fadeIn(1);
        locale = "es_ES";
        loadMenu();
        $("#menuInicio").addClass( "current-menu" );
        $("#menuServiciosProductos").removeClass( "current-menu" );
        $("#menuContacto").removeClass( "current-menu" );
        switchText( "inicio" );
    });
    $("#en_UK").click( function() {
        $("#contents *").stop().fadeIn(1);
        locale = "en_UK";
        loadMenu();
        $("#menuInicio").addClass( "current-menu" );
        $("#menuServiciosProductos").removeClass( "current-menu" );
        $("#menuContacto").removeClass( "current-menu" );
        switchText( "inicio" );
    });

    $(window).resize( function() {
        center();
    });

    loadMenu();

    switchPage( "inicio" );

    center();
});


var menuTexts = {
    "menuInicio": "inicio",
    "menuTrabajosRealizados": "trabajos",
    "menuVideos": "videos",
    "menuServiciosProductos": "servicios",
    "menuContacto": "contacto"
};

function loadMenu() {
    $("#main-menu").load( "pages/" + locale + "/menu/menu.htxt", function() {

        $(".menu-item").click(function(){
            $("#contents *").stop().fadeIn(1);
            $(".menu-item").removeClass("current-menu");
            $(this).addClass("current-menu");

            hidePopupServiciosProductos();

            switchText(menuTexts[$(this).attr("id")]);
        });

        $("#submenu-panel").load( "pages/" + locale + "/menu/serviciosProductos.htxt", function() {
            $("#menuServiciosProductos").hover(
                function() {
                    $("#popupServiciosProductos").show();
                    clearTimeout(popupServiciosProductosTimer);
                },
                function() {
                    popupServiciosProductosTimer = setTimeout("hidePopupServiciosProductos()",300);
                }
                );
            $("#popupServiciosProductos li").hover(
                function() {
                    clearTimeout(popupServiciosProductosTimer);
                    $(this).addClass("hover");
                },
                function() {
                    $(this).removeClass("hover");
                    if ( ! ($("#popupServiciosProductos li").hasClass("hover")) )
                        popupServiciosProductosTimer = setTimeout("hidePopupServiciosProductos()",300);
                }
                );
        });
    });
}


function hidePopupServiciosProductos() {
    $("#popupServiciosProductos").hide();
}


function serviciosProductos( tabNro ) {
    $("#contents *").stop().fadeIn(1);

    $("#menuInicio").removeClass( "current-menu" );
    $("#menuServiciosProductos").addClass( "current-menu" );
    $('#menuTrabajosRealizados').removeClass('current-menu');
    $('#menuVideos').removeClass('current-menu');
    $("#menuContacto").removeClass( "current-menu" );

    switchText( "servicios", tabNro );
    $("#popupServiciosProductos").hide();
}


var currentPage;
var pagesArray;
function magicSlice( loadImages ) {
    currentPage = 0;

    var mainPanel = $("#slider-contents");

    pagesArray = mainPanel.children(".page");

    if ( pagesArray.length > 0 ) {
        var pageImages = jQuery( pagesArray.get(0) );
        if ( loadImages && pageImages != null && pageImages.attr( "images" ) != undefined)
            switchImages( pageImages.attr( "images" ) );
    }

    pagesArray.each( function( j, page ) {

        page = jQuery( page );

        var pageWidth = mainPanel.width() - 30;
        var leftPos = j * mainPanel.width() + 15;

        page.css( {
            position: "absolute",
            width: pageWidth,
            left: leftPos,
            top: 0
        });

    });

    mainPanel.find("#page-counter").text( (currentPage + 1) + " / " + pagesArray.length );

    mainPanel.find(".back").click( function() {
        sliceToPage( currentPage - 1 );
    });

    mainPanel.find(".next").click( function() {
        sliceToPage( currentPage + 1 );
    });
}


function sliceToPage( index ) {
    if ( index < 0 )
        index = pagesArray.length - 1;
    if ( index >= pagesArray.length )
        index = 0;

    currentPage = index;

    var mainPanel = $("#slider-contents");

    var panelMargin = (-1 * index * mainPanel.width());

    var pageImages = jQuery( pagesArray.get( index ) );
    if ( pageImages != null && pageImages.attr( "images" ) != null )
        switchImages( pageImages.attr( "images" ) );

    mainPanel.animate( {
        marginLeft: (panelMargin + "px")
    }, 500, "swing", function() {
        mainPanel.find("#page-counter").text( (index + 1) + " / " + pagesArray.length );

        mainPanel.find(".slider-controls").animate( {
            marginLeft: ((-1 * panelMargin) + "px")
        }, 500);
    });
}


function switchPage( page ) {
    switchText( page );
    switchImages( page + "-img" );
// $('#images').pngfix();
}


var currentText;
function switchText( page, tabNro ) {
    currentText = page;
    mainText.fadeOut( "slow", function() {
        mainText.hide();
        mainText.text("");
        var loadImages = (typeof tabNro == "undefined");
        mainText.load( "pages/" + locale + "/" + page + ".htxt", function() {
            magicSlice(loadImages)
        } );
        mainText.fadeIn( "slow", function() {
            mainText.show();
            if ( !loadImages )
                sliceToPage( tabNro );
        });
    });
}


var currentImage;
function switchImages( page ) {
    if ( page != currentImage ) {

        if ( timerID != 0 ) {
            clearTimeout( timerID );
            timerID = 0;
        }

        currentImage = page;

        var images = $("#images");
        images.fadeOut( "normal", function() {
            images.hide();
            images.text("");
            images.load( "pages/" + locale + "/" + page + ".htxt" );
            images.fadeIn( "normal" );
        });
    }
}


function isVisible( target ) {
    var i = 0;
    while ( i < imgArray.length && imgArray[i] != target )
        i++;
    return (i < imgArray.length);
}


function initMatrix() {
    var source;
    for ( source=0; source<9; source++ ) {
        var target = Math.floor(Math.random()*15);
        while ( isVisible( target ) )
            target = Math.floor(Math.random()*15);

        var img = $("#mtx"+source);
        img.attr( "src", "img/mtx/m-" + target + ".jpg" );

        imgArray[source] = target;

        if ( Math.floor(Math.random()*2) == 0 )
            img.fadeTo( "slow", 0.20 );
    }

    timerID = setTimeout("animateMatrix()", Math.floor(Math.random()*2000)+1000);
}


function animateMatrix() {
    var target = Math.floor(Math.random()*15);
    while ( isVisible( target ) )
        target = Math.floor(Math.random()*15);

    var source = Math.floor(Math.random()*9);

    var img = $("#mtx"+source);
    img.fadeOut( "slow", function() {
        img.hide();
        img.fadeTo( "fast", 1.0 );
        img.attr( "src", "img/mtx/m-" + target + ".jpg" );
        img.fadeIn( "slow" );
    });

    imgArray[source] = target;

    source = Math.floor(Math.random()*9);
    $("#mtx"+source).fadeTo( "slow", 0.20 );

    timerID = setTimeout("animateMatrix()", Math.floor(Math.random()*2000)+2000);
}


function center() {
    var windowHeight = $(window).height();

    if ( windowHeight > 630 ) {
        var darkBgHeight = windowHeight / 2 - 145;
        $("#dark-bg").height( darkBgHeight );

        var headerMargin = darkBgHeight - 190;
        $("#header").css( "margin-top", headerMargin );
    }
}


function echeck(str) {

    var at="@"
    var dot="."
    var lat=str.indexOf(at)
    var lstr=str.length
    var ldot=str.indexOf(dot)

    if (str.indexOf(at)==-1)
        return false

    if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr)
        return false

    if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr)
        return false

    if (str.indexOf(at,(lat+1))!=-1)
        return false

    if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot)
        return false

    if (str.indexOf(dot,(lat+2))==-1)
        return false
		
    if (str.indexOf(" ")!=-1)
        return false

    return true
}


function contactSendMail() {
    var nameVal = "" + $("#name").val();
    var emailVal = "" + $("#email").val();
    var subjectVal = "" + $("#subject").val();
    var bodyVal = "" + $("#body").val();



    var params = {
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        body: bodyVal
    };

    jQuery.ajax({
        url:      "php/enviar_email.php",
        type:     "POST",

        data:     params,

        dataType: "json",

        error:    function(request, textStatus) {
            alert( "ERROR intentando enviar el mensaje: " + textStatus );
        },

        success:  function( data ) {

            if(data.validaciones !== undefined){
                for(var validacion in data.validaciones){
                    $('#validacion').text(data.validaciones[validacion]);
                    break;
                }

            } else {
                $("#name").val( "" );
                $("#email").val( "" );
                $("#subject").val( "" );
                $("#body").val( "" );
                $('#validacion').text('Mensaje enviado');
            }
        }
    });
}

function contactError( field, message ) {
    $("#"+field).removeClass( "grey" );
    $("#"+field).addClass( "error" );
    $("#"+field).attr("value",message);
}


function contact() {
    /*	$("#enviar").click( function() {
		$("#enviar").attr( "disabled", "true" );
		$("#working").show();

		$("#images").load( "php/enviar_email.php" );
	});*/

    $("#contact input[type='text'], #contact textarea").focus( function() {
        if ( $(this).hasClass( "error" ) ) {
            $(this).removeClass( "error" );
            $(this).attr("value","");
        }
        $(this).removeClass( "grey" );
        $(this).addClass( "orange" );
    });

    $("#contact input[type='text'], #contact textarea").blur( function() {
        $(this).removeClass( "orange" );
        $(this).addClass( "grey" );
    });
}
