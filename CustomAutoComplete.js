function BuildAutoCompleteTagEditor(sourceCtrlID, id, selectionTextBoxID) {
  var dataTags = [];
  var dataTagValues = [];
  $("#" + sourceCtrlID + " option").each(function () {
    if ($(this).val()) {
      dataTags.push(this.text);
      dataTagValues.push(unicodeToChar(this.value));
    }
  });
  function func(dataTags, dataTagValues) {
    const obj = {};
    dataTags.forEach((Curr_element, index) => {
      obj[Curr_element] = dataTagValues[index];
    });
    return obj;
  }
  $("#" + id + " .txtTagJson").val(
    JSON.stringify(func(dataTags, dataTagValues))
  );
  $(function () {
    $.widget("ui.autocomplete", {
      version: "1.10.4",
      defaultElement: "<input>",
      options: {
        appendTo: null,
        autoFocus: false,
        delay: 100,
        minLength: 1,
        position: { my: "left top", at: "left bottom", collision: "none" },
        source: null,
        change: null,
        close: null,
        focus: null,
        open: null,
        response: null,
        search: null,
        select: null,
      }, 
      requestIndex: 0,
      pending: 0,
      _create: function () {
        var suppressKeyPress,
          suppressKeyPressRepeat,
          suppressInput,
          nodeName = this.element[0].nodeName.toLowerCase(),
          isTextarea = nodeName === "textarea",
          isInput = nodeName === "input";
        this.isMultiLine = isTextarea
          ? true
          : isInput
          ? false
          : this.element.prop("isContentEditable");
        this.valueMethod = this.element[isTextarea || isInput ? "val" : "text"];
        this.isNewMenu = true;
        this.element
          .addClass("ui-autocomplete-input")
          .attr("autocomplete", "off");
        this._on(this.element, {
          keydown: function (event) {
            if (this.element.prop("readOnly")) {
              suppressKeyPress = true;
              suppressInput = true;
              suppressKeyPressRepeat = true;
              return;
            }
            suppressKeyPress = false;
            suppressInput = false;
            suppressKeyPressRepeat = false;
            var keyCode = $.ui.keyCode;
            switch (event.keyCode) {
              case keyCode.PAGE_UP:
                suppressKeyPress = true;
                this._move("previousPage", event);
                break;
              case keyCode.PAGE_DOWN:
                suppressKeyPress = true;
                this._move("nextPage", event);
                break;
              case keyCode.UP:
                suppressKeyPress = true;
                this._keyEvent("previous", event);
                break;
              case keyCode.DOWN:
                suppressKeyPress = true;
                this._keyEvent("next", event);
                break;
              case keyCode.ENTER:
              case keyCode.NUMPAD_ENTER:
                if (this.menu.active) {
                  suppressKeyPress = true;
                  event.preventDefault();
                  this.menu.select(event);
                }
                break;
              case keyCode.TAB:
                if (this.menu.active) {
                  this.menu.select(event);
                }
                break;
              case keyCode.ESCAPE:
                if (this.menu.element.is(":visible")) {
                  this._value(this.term);
                  this.close(event);
                  event.preventDefault();
                }
                break;
              default:
                suppressKeyPressRepeat = true;
                this._searchTimeout(event);
                break;
            }
          },
          keypress: function (event) {
            if (suppressKeyPress) {
              suppressKeyPress = false;
              if (!this.isMultiLine || this.menu.element.is(":visible")) {
                event.preventDefault();
              }
              return;
            }
            if (suppressKeyPressRepeat) {
              return;
            }
            var keyCode = $.ui.keyCode;
            switch (event.keyCode) {
              case keyCode.PAGE_UP:
                this._move("previousPage", event);
                break;
              case keyCode.PAGE_DOWN:
                this._move("nextPage", event);
                break;
              case keyCode.UP:
                this._keyEvent("previous", event);
                break;
              case keyCode.DOWN:
                this._keyEvent("next", event);
                break;
            }
          },
          input: function (event) {
            if (suppressInput) {
              suppressInput = false;
              event.preventDefault();
              return;
            }
            this._searchTimeout(event);
          },
          focus: function () {
            this.selectedItem = null;
            this.previous = this._value();
          },
          blur: function (event) {
            if (this.cancelBlur) {
              delete this.cancelBlur;
              return;
            }
            clearTimeout(this.searching);
            this.close(event);
            this._change(event);
          },
        });
        this._initSource();
        this.menu = $("<ul>")
          .addClass("ui-autocomplete ui-front")
          .appendTo(this._appendTo())
          .menu({ role: null })
          .hide()
          .data("ui-menu");
        this._on(this.menu.element, {
          mousedown: function (event) {
            event.preventDefault();
            this.cancelBlur = true;
            this._delay(function () {
              delete this.cancelBlur;
            });
            var menuElement = this.menu.element[0];
            if (!$(event.target).closest(".ui-menu-item").length) {
              this._delay(function () {
                var that = this;
                this.document.one("mousedown", function (event) {
                  if (
                    event.target !== that.element[0] &&
                    event.target !== menuElement &&
                    !$.contains(menuElement, event.target)
                  ) {
                    that.close();
                  }
                });
              });
            }
          },
          menufocus: function (event, ui) {
            if (this.isNewMenu) {
              this.isNewMenu = false;
              if (
                event.originalEvent &&
                /^mouse/.test(event.originalEvent.type)
              ) {
                this.menu.blur();
                this.document.one("mousemove", function () {
                  $(event.target).trigger(event.originalEvent);
                });
                return;
              }
            }
            var item = ui.item.data("ui-autocomplete-item");
            if (false !== this._trigger("focus", event, { item: item })) {
              if (
                event.originalEvent &&
                /^key/.test(event.originalEvent.type)
              ) {
                this._value(item.value);
              }
            } else {
              this.liveRegion.text(item.value);
            }
          },
          menuselect: function (event, ui) {
            var item = ui.item.data("ui-autocomplete-item"),
              previous = this.previous;
            if (this.element[0] !== this.document[0].activeElement) {
              this.element.focus();
              this.previous = previous;
              this._delay(function () {
                this.previous = previous;
                this.selectedItem = item;
              });
            }
            if (false !== this._trigger("select", event, { item: item })) {
            }
            this.term = "";
            this.close(event);
            this.selectedItem = item;
          },
        });
        this.liveRegion = $("<span>", { role: "status", "aria-live": "polite" })
          .addClass("ui-helper-hidden-accessible")
          .insertBefore(this.element);
        this._on(this.window, {
          beforeunload: function () {
            this.element.removeAttr("autocomplete");
          },
        });
      },
      _destroy: function () {
        clearTimeout(this.searching);
        this.element
          .removeClass("ui-autocomplete-input")
          .removeAttr("autocomplete");
        this.menu.element.remove();
        this.liveRegion.remove();
      },
      _setOption: function (key, value) {
        this._super(key, value);
        if (key === "source") {
          this._initSource();
        }
        if (key === "appendTo") {
          this.menu.element.appendTo(this._appendTo());
        }
        if (key === "disabled" && value && this.xhr) {
          this.xhr.abort();
        }
      },
      _appendTo: function () {
        var element = this.options.appendTo;
        if (element) {
          element =
            element.jquery || element.nodeType
              ? $(element)
              : this.document.find(element).eq(0);
        }
        if (!element) {
          element = this.element.closest(".ui-front");
        }
        if (!element.length) {
          element = this.document[0].body;
        }
        return element;
      },
      _initSource: function () {
        var array,
          url,
          that = this;
        if (Array.isArray(this.options.source)) {
          array = this.options.source;
          this.source = function (request, response) {
            response($.ui.autocomplete.filter(array, request.term));
          };
        } else if (typeof this.options.source === "string") {
          url = this.options.source;
          this.source = function (request, response) {
            if (that.xhr) {
              that.xhr.abort();
            }
            that.xhr = $.ajax({
              url: url,
              data: request,
              dataType: "json",
              success: function (data) {
                response(data);
              },
              error: function () {
                response([]);
              },
            });
          };
        } else {
          this.source = this.options.source;
        }
      },
      _searchTimeout: function (event) {
        clearTimeout(this.searching);
        this.searching = this._delay(function () {
          if (this.term !== this._value()) {
            this.selectedItem = null;
            this.search(null, event);
          }
        }, this.options.delay);
      },
      search: function (value, event) {
        value = value != null ? value : this._value();
        this.term = this._value();
        if (value.length < this.options.minLength) {
          return this.close(event);
        }
        if (this._trigger("search", event) === false) {
          return;
        }
        return this._search(value);
      },
      _search: function (value) {
        this.pending++;
        this.element.addClass("ui-autocomplete-loading");
        this.cancelSearch = false;
        this.source({ term: value }, this._response());
      },
      _response: function () {
        var index = ++this.requestIndex;
        return $.proxy(function (content) {
          if (index === this.requestIndex) {
            this.__response(content);
          }
          this.pending--;
          if (!this.pending) {
            this.element.removeClass("ui-autocomplete-loading");
          }
        }, this);
      },
      __response: function (content) {
        if (content) {
          content = this._normalize(content);
        }
        this._trigger("response", null, { content: content });
        if (
          !this.options.disabled &&
          content &&
          content.length &&
          !this.cancelSearch
        ) {
          this._suggest(content);
          this._trigger("open");
        } else {
          this._close();
        }
      },
      close: function (event) {
        this.cancelSearch = true;
        this._close(event);
      },
      _close: function (event) {
        if (this.menu.element.is(":visible")) {
          this.menu.element.hide();
          this.menu.blur();
          this.isNewMenu = true;
          this._trigger("close", event);
        }
      },
      _change: function (event) {
        if (this.previous !== this._value()) {
          this._trigger("change", event, { item: this.selectedItem });
        }
      },
      _normalize: function (items) {
        if (items.length && items[0].label && items[0].value) {
          return items;
        }
        return $.map(items, function (item) {
          if (typeof item === "string") {
            return { label: item, value: item };
          }
          return $.extend(
            {
              label: item.label || item.value,
              value: item.value || item.label,
            },
            item
          );
        });
      },
      _suggest: function (items) {
        var ul = this.menu.element.empty();
        this._renderMenu(ul, items);
        this.isNewMenu = true;
        this.menu.refresh();
        ul.show();
        this._resizeMenu();
        ul.position($.extend({ of: this.element }, this.options.position));
        if (this.options.autoFocus) {
          this.menu.next();
        }
      },
      _resizeMenu: function () {
        var ul = this.menu.element;
        ul.outerWidth(
          Math.max(ul.width("").outerWidth() + 1, this.element.outerWidth())
        );
      },
      _renderMenu: function (ul, items) {
        var that = this;
        $.each(items, function (index, item) {
          that._renderItemData(ul, item);
        });
      },
      _renderItemData: function (ul, item) {
        return this._renderItem(ul, item).data("ui-autocomplete-item", item);
      },
      _renderItem: function (ul, item) {
        return $("<li>").append($("<a>").text(item.label)).appendTo(ul);
      },
      _move: function (direction, event) {
        if (!this.menu.element.is(":visible")) {
          this.search(null, event);
          return;
        }
        if (
          (this.menu.isFirstItem() && /^previous/.test(direction)) ||
          (this.menu.isLastItem() && /^next/.test(direction))
        ) {
          this._value(this.term);
          this.menu.blur();
          return;
        }
        this.menu[direction](event);
      },
      widget: function () {
        return this.menu.element;
      },
      _value: function () {
        return this.valueMethod.apply(this.element, arguments);
      },
      _keyEvent: function (keyEvent, event) {
        if (!this.isMultiLine || this.menu.element.is(":visible")) {
          this._move(keyEvent, event);
          event.preventDefault();
        }
      },
    });
    let inputTagData = $("#" + id + " .skills")
      .val()
      .split(";");
    var arrHiddenData = "";
    $("#" + id + " .tag-input").autocomplete({
      source: function (request, response) {
        var term = request.term.toLowerCase();
        var results = dataTags.filter(function (tag) {
          return tag.toLowerCase().startsWith(term);
        });
        response(results.slice(0, this.options.maxResults));
      },
      //changes for setting width and position
      open: function () {
        const $textbox = $(this);
        const $label = $textbox.parents("label").first();
        const $ul = $(".ui-autocomplete.ui-front.ui-menu");
        const offset = $label.offset();
        const height = $label.outerHeight();

        $ul.css({
          position: "absolute",
          top: offset.top + height,
          left: offset.left,
          width: $label.outerWidth(),
          zIndex: 1000,
        });
      },
      maxResults: 10,
      select: function (e, ui) {
        $("#" + id + " .tag-input").val("");
        if ($.inArray(ui.item.value, inputTagData) == -1) {
          var splitNameAndValue = ui.item.value
            ? ui.item.value.split(",")
            : null;
          var name =
            splitNameAndValue.length > 0 ? splitNameAndValue[0] : ui.item.value;
          inputTagData.push(name);
          var encodedValue = $("<div>").text(ui.item.value).html();
          $("#" + id + " .tags").css("display", "block");
          $("#" + id + " .tags").append(
            "<div class='tag_list'>" +
              encodedValue +
              "<a href='javascript:' class='fas fa-times remove' title='" +
              ui.item.value +
              "'></a></div>"
          );
          arrReloadData();
          managePlaceHolder();
        }
      },
    });
    $("#" + id + " .tags").on("click", "a", function (e) {
      e.preventDefault();
      inputTagData.splice($.inArray($(this).attr("title"), inputTagData), 1);
      $(this).parent().remove();
      arrReloadData();
      managePlaceHolder();
    });
    function arrReloadData() {
      arrHiddenData = "";
      jQuery.each(inputTagData, function () {
        if (arrHiddenData == "") {
          arrHiddenData = this;
        } else {
          arrHiddenData = arrHiddenData + "; " + this;
        }
      });
      $("#" + id + " .skills").val(arrHiddenData);
    }
    function SetSelectedAutoCompleteInputTagsNew(
      sourceCtrlID,
      selectionTextBoxID,
      id
    ) {
      try {
        var value = $("#" + selectionTextBoxID).val();
        if (value.length > 0) {
          value = value.split("; ");
        }
        var jqElements = [];
        value.forEach(function (element) {
          if (element)
            jqElements.push(
              $("#" + sourceCtrlID + ' option[value="' + element + '"]')
            );
        });
        value.forEach(function (element) {
          if (element) {
            var data = element;
            $("#" + id + " .tag-input").val("");

            inputTagData = $.map(inputTagData, function (value) {
              return (value || "").trim();
            });
            if ($.inArray(data, inputTagData) == -1) {
              var splitNameAndValue = data ? data.split(",") : null;
              var name =
                splitNameAndValue.length > 0 ? splitNameAndValue[0] : data;
              //if (checkSelectedValue(inputTagData[0], name)) {
              inputTagData.push(name);
              $("#" + id + " .tags").css("display", "block");
              var encodedValue = $("<div>").text(data).html();
              $("#" + id + " .tags").append(
                "<div class='tag_list'>" +
                  encodedValue +
                  "<a href='javascript:' class='remove' title='" +
                  data +
                  "'><i class='fas fa-times'></i></a></div>"
              );
              arrReloadData();
              //}
            }
          }
        });
      } catch (error) {
        console.log("Error in [SetSelectedAutoCompleteInputTags]: ", error);
      }
    }
    // if ($('#' + selectionTextBoxID).val() != undefined && $('#' + selectionTextBoxID).val() != "" && $('#' + selectionTextBoxID).length>0) {
    //     SetSelectedAutoCompleteInputTagsNew(sourceCtrlID, selectionTextBoxID, id);
    // }
    if (selectionTextBoxID && $("#" + selectionTextBoxID).length > 0) {
      var val = $("#" + selectionTextBoxID).val();
      if (val !== undefined && val !== "") {
        SetSelectedAutoCompleteInputTagsNew(
          sourceCtrlID,
          selectionTextBoxID,
          id
        );
      }
    }
  });

  function managePlaceHolder() {
    if ($("#" + id + " .tags").children().length > 0) {
      $("#" + id + " .tagwaku")
        .children("input .tag-input")
        .attr("placeholder", "");
    } else {
      $("#" + id + " .tagwaku")
        .children("input .tag-input")
        .attr("placeholder", "Please select...");
    }
  }
  $("#" + id + " .tag-input").on("change", function () {
    $("#" + id + " .tag-input").val("");
  });
}
function removeAutoCompleteData(sourceCtrlID, id) {
  $("#" + id + " .tag-input").val("");
  $("#" + id + " .tags").html("");
  $("#" + id + " .skills").removeAttr("value");
  BuildAutoCompleteTagEditor(sourceCtrlID, id, "");
}
function GetSelectedAutoCompleteInputTagsValues(lblCtrlID) {
  try {
    var tagObj = JSON.parse($("#" + lblCtrlID + " .txtTagJson").val());
    var value = $("#lblctrl_" + lblCtrlID + " .skills")
      .val()
      .split(";");
    var tagVal = "";
    for (let i = 0; i < value.length; i++) {
      tagVal = tagVal + tagObj[value[i].trim()] + ";";
    }
    return tagVal;
  } catch (error) {
    console.log("Error in [GetSelectedTags]: ", error);
  }
}
//hide on scroll
$(".public_banner").on("scroll", function () {
  $(".ui-autocomplete.ui-front.ui-menu").hide();
});

