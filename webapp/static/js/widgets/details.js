define(['jquery', 'data-streams/details',
    'debug',
    'app-data',
    'template!templates/details-widget',
    'template!templates/details-widget-song-list'],
function ($, detailsDataStream,
    debug,
    appData,
    detailsWidgetTemplate,
    detailsWidgetSongListTemplate) {

    function DetailsWidget($element, item) {
        this.$element = $element;
        this.item = item;
    }
    DetailsWidget.prototype = {
        render: function () {
            var self = this;
            this.$element.html(detailsWidgetTemplate({
                item: this.item
            }));
            this.$element.on("click", "a", function (event) {
                var $link = $(this);
                var dataAction = $link.data("action");
                if (dataAction && self[dataAction]) {
                    event.preventDefault();
                    self[dataAction]();
                }
            });
        },
        startRadio: function () {
            var player = appData.get("player");
            if (!player) {
                debug.log.error("Player not initialized.");
                this.$element.append('<p class="error">Player doesn\'t exist...</p>');
                return;
            }
            player.startRadio(this.item);
        },
        listSongs: function () {
            detailsDataStream.listSongs(this.item.title, function (error, songs) {
                if (error) {
                    debug.log.error("Error listing songs - " + error);
                    renderSongList({
                        error: "Couldn't list songs."
                    });
                    return;
                }
                renderSongList({
                    songs: songs
                });

            });
            function renderSongList(context) {
                var $songListElement = this.$element.find('.song-list');
                $songListElement.html(detailsWidgetSongListTemplate(context));
            }
            renderSongList({ loading: true });
        }
    };

    function create(elementOrSelector) {
        return new DetailsWidget($(elementOrSelector));
    }
    return {
        create: create
    }
});
