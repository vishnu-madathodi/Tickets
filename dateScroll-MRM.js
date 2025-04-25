
    function tblUpcomingTaskDates(tblID, btnBackID, btnNextID) {
        try {
            let currentPageForMembers = 0;
            var tbl = $("#" + tblID).find('.fixedTable'); // Table container
            var btnBack = $("#" + btnBackID); // Back button
            var btnNext = $("#" + btnNextID); // Next button
            $("#" + tblID + " .dt-scroll-body").css('overflow', 'hidden');

            var scroll = $("#" + tblID + " .dt-scroll-body");

            var widthToScroll = $("#" + tblID).width(); // Visible width of the table
            var totalPages = Math.ceil(tbl.prop('scrollWidth') / widthToScroll);

      

            highlightSundays(); // Highlight Sundays
            updateButtonState(); 


            // Assuming tblID is the ID of your table
            $("#" + tblID).find(".fixedTable").find("td").off("click.dateClick").on("click.dateClick", function () {
                $("#" + tblID).find(".fixedTable").find("td div").removeClass("highlight");
                $("#" + tblID).find(".fixedTable").find("td div").each(function () {
                    if ($(this).hasClass("sundaycs") && $(this).hasClass("sundayclick")) {
                        $(this).removeClass("sundayclick");
                    }
                });

                // Add the 'highlight' class to the <div> inside the clicked <td>
                $(this).find("div").addClass("highlight");

                const isFirstTd = $(this).is(":first-child");
                const firstTd = $("#" + tblID).find(".fixedTable").find("tr:first-child td:first-child ");
                if (!isFirstTd) {

                    firstTd.find("div").addClass("trfirsttd");

                } else if (isFirstTd) {

                    firstTd.find("div").removeClass("highlight trfirsttd ");
                }
            });



            btnBack.off("click.backClick").on("click.backClick", function (event) {
                try {
                    event.preventDefault();
                    if (currentPageForMembers > 0) {
                        --currentPageForMembers;
                        scrollToCurrentPage();
                    }
                } catch (error) {
                    console.error("Error on back button click:", error);
                }
            });

            btnNext.off("click.nextClick").on("click.nextClick", function (event) {
                try {
                    event.preventDefault();
                    if (currentPageForMembers < totalPages - 1) {
                        ++currentPageForMembers;
                        scrollToCurrentPage();
                    }
                } catch (error) {
                    console.error("Error on next button click:", error);
                }
            });

            function scrollToCurrentPage() {
                try {
                    const scrollToPosition = currentPageForMembers * widthToScroll;
                    scroll.animate({
                        scrollLeft: scrollToPosition
                    }, "slow");
                    updateButtonState();
                } catch (error) {
                    console.error("Error in scrollToCurrentPage:", error);
                }
            }

            function updateButtonState() {
                try {
                    btnBack.toggleClass("disabled-button", currentPageForMembers === 0).attr("disabled", currentPageForMembers === 0);
                    btnNext.toggleClass("disabled-button", currentPageForMembers === totalPages - 1).attr("disabled", currentPageForMembers === totalPages - 1);
                } catch (error) {
                    console.error("Error updating button state:", error);
                }
            }

            function highlightSundays() {
                try {
                    tbl.find("tr").each(function () {
                        $(this).find("td").each(function () {
                            const cellText = $(this).text().trim();
                            if (cellText.endsWith("Sun")) {
                                $(this).find(".db-CU-ut-bx").addClass("sundaycs");
                                $(this).find(".db-CU-ut-bx").removeClass("highlight ");
                                $(this).find(".bx-child").removeClass("highlight ");
                                $(this).find(".iefixwordwrap").removeClass("highlight ");
                                const sundayCell = $(this);
                                sundayCell.off("click.sundayClick").on("click.sundayClick", function () {

                                    $(this).find(".db-CU-ut-bx").removeClass("sundaycs");
                                    $(this).find(".db-CU-ut-bx").addClass("sundayclick");

                                });
                            }
                        });
                    });
                } catch (error) {
                    console.error("Error highlighting Sundays:", error);
                }
            }
        } catch (error) {
            console.error("Error initializing the tblCarousel function:", error);
        }
    }