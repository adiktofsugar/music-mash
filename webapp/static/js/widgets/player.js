define(['jquery', 'app-data', 'data-stream/player',
    'template!templates/player-widget',
    'template!templates/player-widget-playlist'],
function ($, appData, playerDataStream,
    playerWidgetTemplate,
    playerWidgetPlaylistTemplate) {

    function PlayerWidget($element) {
        appData.set("player", this);
        this.$element = $element;
    }
    PlayerWidget.prototype = {
        render: function () {
            this.$element.html(playerWidgetTemplate());
            this.setPlaylist();
        },
        setPlaylist: function (songs) {
            var self = this;
            function renderPlaylist(context) {
                var $element = self.$element.find(".playlist");
                $element.html(playerWidgetPlaylistTemplate(context);
            }
            renderPlaylist({
                songs: songs
            });
        },
        clearPlaylist: function () {
            this.setPlaylist();
        },
        play: function () {
            var $playlistElement = self.$element.find(".playlist");
            var $activeSongElement = $playlistElement.find(".song.active");
            if (activeSongElement.length <= 0) {
                $activeSongElement = $playlistElement.find(".song").first();
            }
            var songTitle = $activeSongElement.data("title");
            var songArtist = $activeSongElement.data("artist");

            var $audio = this.$element.find('audio');

            function getSongPart(startTime) {
                startTime = (startTime === undefined) ? 0 : startTime;

                var parameters = {
                    title: songTitle,
                    artist: songArtist,
                    startTime: startTime
                };
                playerDataStream.getSongFile(parameters, function (error, url) {
                    if (error) {
                        return getSongPart(startTime);
                    }
                    // somehow set the source
                });
            }
            getSongPart();
        },
        stop: function () {
            var $audio = this.$element.find('audio');
            $audio[0].stop();
        },
        setVolume: function (volume) {
            var $audio = this.$element.find('audio');
            $audio[0].volume = volume;
        }
    };

    
    function create(elementOrSelector) {
        return new PlayerWidget($(elementOrSelector));
    }

    return {
        create: create
    };
});
