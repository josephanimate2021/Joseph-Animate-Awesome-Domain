var worknoteApi={addNote:function(b){var a=$.post("/ajax/addWorknote",b,null,"json");return a},addNoteWOL:function(b){var a=$.post("/ajax/addWorknoteWOL",b,null,"json");return a},addReply:function(b){var a=$.post("/ajax/",b,null,"json");return a},removeNote:function(b){var a=$.post("/ajax/deleteWorknote",b,null,"json");return a},removeNoteWOL:function(b){var a=$.post("/ajax/deleteWorknoteWOL",b,null,"json");return a},resolveNote:function(b){var a=$.post("/ajax/resolveWorknote",b,null,"json");return a}};var WorknoteModule=function(b,d,c,a){this.aside_block_class="aside-block-worknotes";this.template='<div class="aside-block '+this.aside_block_class+'"><div class="content"></div></div>';this.$el=c;this.movieId=b;this.accessId=d||"";this.scenes=[];this.csrfToken=a;this.legacyPlayer=flashPlayerApi($("#flash-player"));this.initialize()};WorknoteModule.prototype={initialize:function(){this.show();var a=this;this.$el.on("click",".worknotes-container .scene-note-header",function(d){d.preventDefault();var c=$(this).closest(".scene-note");a.seekToScene(c)}).on("click",'[data-action="note-reply"]',function(d){d.preventDefault();var c=$(this).closest(".scene-note").data("scene-id");var f=$(this).closest(".worknote").data("note-id");a.showReply(c,f)}).on("click",'[data-action="note-reply-dismiss"]',function(){a.hideReply()}).on("click",'[data-action="note-resolve"]',function(f){f.preventDefault();var c=($(this).data("status")=="new")?0:1;var d={mid:a.movieId,aid:a.accessId,noteId:$(this).closest(".worknote").data("note-id"),reopen:c,ct:a.csrfToken};a.resolveNote(d)}).on("click",'[data-action="note-delete"]',function(d){d.preventDefault();if(!confirm(GT.gettext("Are you sure you have to delete this note?"))){return}var c={mid:a.movieId,aid:a.accessId,noteId:$(this).closest(".worknote").data("note-id"),ct:a.csrfToken};a.removeNote(c)}).on("submit",".worknote-post-form, .worknote-reply-form",function(f){f.preventDefault();var c=$(this);var d=$(this).serializeArray();d.push({name:"mid",value:a.movieId},{name:"aid",value:a.accessId},{name:"ct",value:a.csrfToken});if(c.hasClass("worknote-post-form")){a.addNote($.param(d))}else{a.addReply($.param(d))}});if(this.legacyPlayer.ready){var b=a.legacyPlayer.getScenesInfo();a.scenes=b||a.scenes}this.legacyPlayer.bind("scene",function(f,d){var c=d.guid;a.highlightScene(c);a.updateNoteTimeByGuid(c)}).bind("pause play end",function(c){$("#worknotes-module").toggleClass("show-form",!a.legacyPlayer.playing);if(c.type=="end"){a.$el.find('.worknote-post-form [name="scene"]').val("");a.updateNoteTimeByGuid(false)}if(!a.legacyPlayer.playing){a.$el.find('.worknote-post-form [name="note_body"]').focus()}}).bind("ready",function(){var c=a.legacyPlayer.getScenesInfo();a.scenes=c||a.scenes;a.highlightScene(a.legacyPlayer.getSceneGuid());a.processScenesInfo()}).bind("reset",function(){})},show:function(){return this},hide:function(){$("#player-aside").find(".aside-block").hide();$("#video-page").removeClass("player-expand");return this},showReply:function(a,f){var c=this.$el.find(".worknote-reply-wrapper");var e=this.$el.find(".worknote-reply-form");var d=$("<div />").addClass("scene-note");var b=$("#worknote_"+f).clone().removeAttr("id");$("#scene-note_"+a+" .scene-note-header").clone().appendTo(d);d.append('<div class="worknote-separator"></div>');b.find(".worknote-actions").remove();d.append(b);c.find(".scene-note").remove();d.insertBefore(e);e.find('[name="scene"]').val(a).end().find('[name="pnote"]').val(f);c.fadeIn();e.find('[name="note_body"]').focus();$("body").on("click",$.proxy(this.hideReply,this))},hideReply:function(a){if(a&&$(a.target).closest(".worknotes-module").length){return}this.$el.find(".worknote-reply-form").form("reset");this.$el.find(".worknote-reply-wrapper").fadeOut();$("body").off("click",$.proxy(this.hideReply,this))},load:function(){var a=this,c="/ajax/getWorknotesPanel/"+this.movieId+"/video_page",b=this.$el;if(this.accessId){c+="/"+this.accessId}b.empty();$.post(c,function(d){var e=1,f=h5PlayerElem.prop("currentTime").toFixed(e);b.html(d);h5PlayerElem.bind("timeupdate",function(){a.updateNoteTimestamp(h5PlayerElem.prop("currentTime").toFixed(e))});if(parseFloat(f)!==0){a.updateNoteTimestamp(f)}a.processScenesInfo()});this.show()},processScenesInfo:function(){},seekToScene:function(a){},updateNoteTimestamp:function(d){var f=0,a="~"+d+"s",e=$('.worknote-post-form-body input[name="scene"]');$(".note-timestamp").html("<b>"+a+"</b>");for(var b=0;b<sceneDetails.length;b++){var c=sceneDetails[b];f+=parseFloat(c.duration);if(f>d){e.val(c.guid);this.highlightScene(c.guid);break}}},highlightScene:function(a){$(".scene-note").removeClass("scene-note-current");$("#scene-note_"+a).addClass("scene-note-current");var b=this.$el.find("#scene-note_"+a);if(b.length){b.siblings().removeClass("active").end().addClass("active");if(this.$el.find("#scene-note_"+a+":visible").length){$("#worknotes-container").stop().scrollTo(b,400)}}else{$("#worknotes-container").stop().scrollTo(b,0)}this.$el.find('.worknote-post-form [name="scene"]').val(a)},updateNoteTimeByGuid:function(c){var b="none";if(c){for(var d=0,a=this.scenes.length;d<a;++d){if(this.scenes[d].guid==c){b="~"+this.scenes[d].startFrom.toFixed(1)+"s";break}}}$("#worknotes-module .worknotes-module-top .note-timestamp").html("<b>"+b+"</b>")},addNote:function(c){var a=this,b=null;if(this.accessId===""){b=worknoteApi.addNote(c)}else{b=worknoteApi.addNoteWOL(c)}b.done(function(d){if(d.suc){a.$el.find("#scene-note_"+d.scene+" .scene-note-body").html(d.tmpl);a.$el.find(".worknote-post-form")[0].reset();a.$el.find("#scene-note_"+d.scene).show();$(".worknotes-num").text(parseInt($(".worknotes-num").text(),10)+1);$("#worknotes-container").removeClass("empty")}else{if(d.message){showNotice(d.message,true)}}})},removeNote:function(b){var a=null;if(this.accessId===""){a=worknoteApi.removeNote(b)}else{a=worknoteApi.removeNoteWOL(b)}a.done(function(c){if(c.suc){var d=$("#worknote_"+b.noteId).closest(".scene-note");$("#worknote_"+b.noteId).prev(".worknote-separator").remove().end().remove();if(d.find(".worknote").length<1){d.hide()}$(".worknotes-num").text(parseInt($(".worknotes-num").text(),10)-1);$("#worknotes-container").toggleClass("empty",$(".scene-note:visible").length===0)}else{if(c.message){showNotice(c.message,true)}}})},resolveNote:function(b){var a=worknoteApi.resolveNote(b);a.done(function(c){if(c.suc){$("#worknote_"+b.noteId).find('.worknote-actions [data-action="note-resolve"]').data("status",c.status).find("span.note-label-"+("resolved"==c.status?"resolve":"reopen")).hide().end().find("span.note-label-"+("resolved"==c.status?"reopen":"resolve")).show().end().end().toggleClass("dim");if(b.reopen_flag){$(".worknotes-num").text(parseInt($(".worknotes-num").text(),10)+1)}else{$(".worknotes-num").text(parseInt($(".worknotes-num").text(),10)-1)}}else{if(c.message){showNotice(c.message,true)}}})},addReply:function(c){var a=this,b=null;if(this.accessId===""){b=worknoteApi.addNote(c)}else{b=worknoteApi.addNoteWOL(c)}b.done(function(d){if(d.suc){a.$el.find("#scene-note_"+d.scene+" .scene-note-body").html(d.tmpl);a.$el.find("#scene-note_"+d.scene).show();a.$el.find(".worknote-reply-form")[0].reset();a.$el.find('.worknote-reply-form [name="pnote"]').val("");a.hideReply()}else{if(d.message){showNotice(d.message,true)}}})}};

}