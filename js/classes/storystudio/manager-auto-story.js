/** Class ManagerAutoStory */
var ManagerAutoStory = (function () {

    /** Constructor */
    function ManagerAutoStory(selector) {
        var self = this;
        this.$container = $(selector);
        this.$container.data("manager-auto-story", this);

        // Init Sortable on Rules
        this.sortable = new Sortable($('.js-rule-container')[0], {
            animation: 100,
            ghostClass: "my-sortable-ghost",
            dragClass: "my-sortable-drag",
            handle: ".story-drag-handle",
            onEnd: function (evt) {
                let id = $(evt.item).data('rule-id');
                let index = +evt.newIndex;
                $globalStoryManager.sortRule(id, index);
                $storyPlayer.updateStories($globalStoryManager.getAllStories());
            }
        });

        // Render rules to HTML
        ManagerAutoStory.renderRules();

        // Binding events
        this.bindingEvents();
    }

    /** Binding Events */
    ManagerAutoStory.prototype.bindingEvents = function () {
        var self = this;

        // Toggle new rule Popover
        this.$container.find('#add-rule').popover({
            content: function () {
                let $content = $($('.rule-item-tmp').html())
                $content.find('.submit-button').addClass('add-rule-submit');
                $content.find('.cancel-button').addClass('d-none');
                initIcheck($content.find('input[type=checkbox]'));
                return $content;
            },
            html: true,
            sanitize: false
        });
        // Submit new rule
        $(document).on('click', '.add-rule-submit', function () {
            let newRule = Utility.objectifyForm($(this).closest('form').serializeArray());
            newRule.id = StringUtility.uuidv4();
            newRule.duration = +newRule.duration;
            newRule.value = +newRule.value;
            newRule.block = newRule.block == 'on';
            newRule.stop = newRule.stop == 'on';
            $globalStoryManager.addRule(newRule);

            ManagerAutoStory.renderRules();
            $storyPlayer.updateStories($globalStoryManager.getAllStories());
            self.$container.find('#add-rule').popover('hide');
            notify('success', 'Successfully');
        })

        // Edit rule
        this.$container.on('click', '.edit-rule', function () {
            var $ruleItem = $(this).closest('.rule-item');
            var ruleId = $ruleItem.data('rule-id');
            var rules = $globalStoryManager.getRules();
            var targetRule = rules.find(rule => rule.id == ruleId);
            var $form = $('.rule-item-tmp').find('form').clone();
            $form.find('.submit-button').addClass('edit-rule-submit');
            $form.find('.cancel-button').addClass('edit-rule-cancel');
            $form.find('[name=item]').val(targetRule.item);
            $form.find('[name=operator]').val(targetRule.operator);
            $form.find('[name=value]').val(targetRule.value);
            $form.find('[name=title]').val(targetRule.title);
            $form.find('[name=message]').val(targetRule.message);
            $form.find('[name=duration]').val(targetRule.duration);
            if (targetRule.block) $form.find('[name=block]').prop('checked', true);
            if (targetRule.stop) $form.find('[name=stop]').prop('checked', true);
            $ruleItem.html($form);
            initIcheck('.js-rule-container input[type=checkbox]');
        });
        // Cancel Edit
        this.$container.on('click', '.edit-rule-cancel', function () {
            ManagerAutoStory.renderRules();
        });
        // Submit Edit
        this.$container.on('click', '.edit-rule-submit', function () {
            let id = $(this).closest('.rule-item').data('rule-id');
            let editRule = Utility.objectifyForm($(this).closest('form').serializeArray());
            editRule.id = id;
            editRule.duration = +editRule.duration;
            editRule.value = +editRule.value;
            editRule.block = editRule.block == 'on';
            editRule.stop = editRule.stop == 'on';
            $globalStoryManager.updateRule(editRule);

            ManagerAutoStory.renderRules();
            $storyPlayer.updateStories($globalStoryManager.getAllStories());
            notify('success', 'Successfully');
        });

        // Delete rule
        this.$container.on('click', '.delete-rule', function () {
            let id = $(this).closest('.rule-item').data('rule-id');
            $globalStoryManager.removeRule(id);

            ManagerAutoStory.renderRules();
            $storyPlayer.updateStories($globalStoryManager.getAllStories());
            notify('success', 'Successfully');
        });
    };

    /** Convert 1 rule object to HTML */
    ManagerAutoStory.dataRuleToHtml = function (rule) {
        let ruleItem = "";
        let icon_url, story_class = "";

        // Build story CSS class
        if (rule.item == "confirmed" || rule.item == "dailyConfirmed") {
            story_class = "confirmed";
        } else if (rule.item == "active" || rule.item == "dailyActive") {
            story_class = "active";
        } else if (rule.item == "recovered" || rule.item == "dailyRecovered") {
            story_class = "recovered";
        } else if (rule.item == "deaths" || rule.item == "dailyDeaths") {
            story_class = "deaths";
        }

        // Build icon image
        icon_url = "images/icons/" + rule.item;
        if (rule.item.startsWith("daily")) {
            icon_url += ".png";
        } else {
            icon_url += ".svg";
        }

        // Build HTML
        ruleItem = `<div class="story-content ` + story_class + `">
                  <img class="icon" src="` + icon_url + `" title="` + rule.item + `" alt="` + story_class + `">
                  <div class="text">
                    <div class="title">` + rule.title + `</div>
                    <div class="description">` + (rule.message ? rule.message : '') + `</div>
                  </div>
                </div>
                <div class="story-metadata">
                  <div class="story-operator text-info" title="Story Rule">
                    <i class="fa fa-calculator"></i> ` + rule.operator + " " + rule.value + `
                  </div>
                  <div class="story-duration" title="Story Duration">
                    <i class="far fa-clock"></i> ` + (rule.duration ? rule.duration : '') + `ms
                  </div>` +
            (rule.block ? '<div class="story-block" title="Block Time Player"><i class="fa fa-pause"></i> Block</div>' : '') +
            (rule.stop ? '<div class="story-block" title="Stop running below rules if true"><i class="fa fa-ban"></i> Stop</div>' : '') + `
                </div>
                <div class="story-action">
                  <a class="edit-rule" title="Edit"><i class="fa fa-edit"></i></a>
                  <a class="delete-rule" title="Delete"><i class="fa fa-trash-alt"></i></a>
                </div>
                <div class="story-drag-handle"><i class="fas fa-grip-lines"></i></div>`;
        return ruleItem;
    }

    /** Render all rules from local storage */
    ManagerAutoStory.renderRules = function () {
        let rules = $globalStoryManager.getRules();
        $('.js-rule-container').html('');
        rules.forEach(function (rule) {
            let ruleItem = "<div class='rule-item' data-rule-id='" + rule.id + "'>";
            ruleItem += ManagerAutoStory.dataRuleToHtml(rule);
            ruleItem += "</div>";
            $(ruleItem).appendTo('.js-rule-container');
        });
        initIcheck('.js-rule-container input[type=checkbox]');
    }

    return ManagerAutoStory;
})();