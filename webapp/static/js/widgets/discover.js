define(['jquery', 'data-streams/discover', 'debug',
    'template!templates/discover-widget',
    'template!templates/discover-widget-search-results',
    'template!templates/discover-widget-search-result'],
function ($, discoverDataStream, debug,
    widgetTemplate, 
    searchResultsTemplate,
    searchResultTemplate) {

    function DiscoverWidget($element) {
        this.$element = $element;
    }
    DiscoverWidget.prototype = {
        render: function () {
            this.$element.html(widgetTemplate());
            var self = this;
            function searchHandler (event) {
                event.preventDefault();
                self.search();
            };
            this.$element.on('submit', 'form', searchHandler);
        },
        search: function () {
            if (this._searchTimeout) {
                clearTimeout(this._searchTimeout);
                delete this._searchTimeout;
            }
            if (this._searchAjax) {
                this._searchAjax.abort();
                delete this._searchAjax;
            }
            var self = this;
            this._searchTimeout = setTimeout(search, 100);
            function search() {
                var terms = self.$element.find('[name="search"]').val();
                self._searchAjax = discoverDataStream.search(terms, handleSearchResults);
            }
            function handleSearchResults(error, results) {
                if (error) {
                    return renderSearchResults(error);
                }
                renderSearchResults(null, results);
                delete self._searchAjax;
            }
            function renderSearchResults(error, results) {
                var emptySearchResults = (results === null) ||
                    (results && results.length <= 0);

                var $searchResultsElement = self.$element.find('.search-results');
                var errorMessage;
                if (error) {
                    debug.log.error(error);
                    errorMessage = "Couldn't fetch results. " + error.message || "";
                }

                results = (results || []).map(function (result) {
                    return searchResultTemplate(result);
                });
                var firstColumn = results.slice(0, Math.floor(results.length/2));
                var secondColumn = results.slice(firstColumn.length);

                $searchResultsElement.html(searchResultsTemplate({
                    empty_search_results: emptySearchResults,
                    search_results: {
                        first_column: firstColumn,
                        second_column: secondColumn
                    },
                    error: errorMessage
                }));
            }
        }
    };

    function createWidget(elementOrSelector) {
        return new DiscoverWidget($(elementOrSelector));
    }

    return {
        create: createWidget
    };
});
