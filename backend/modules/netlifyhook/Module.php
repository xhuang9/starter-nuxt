<?php
namespace modules\authorinfo;

use Craft;
use craft\helpers\App;
use craft\elements\User;
use craft\events\DefineGqlTypeFieldsEvent;
use craft\gql\TypeManager;
use GraphQL\Type\Definition\Type;
use craft\base\Element;
use craft\events\DefineHtmlEvent;
use craft\elements\Entry;
use craft\events\RegisterTemplateRootsEvent;
use craft\web\View;
use yii\base\Event;

class Module extends \yii\base\Module
{
    public function init()
    {
        // Base template directory
        Event::on(View::class, View::EVENT_REGISTER_CP_TEMPLATE_ROOTS, function(RegisterTemplateRootsEvent $e) {
            if (is_dir($baseDir = $this->getBasePath() . DIRECTORY_SEPARATOR . 'templates')) {
                $e->roots[$this->id] = $baseDir;
            }
        });

        $this->registerEntrySidebar();

        parent::init();
    }

    private function registerEntrySidebar():void{
        // Handler: Entry::EVENT_DEFINE_SIDEBAR_HTML
        Event::on(
            Entry::class,
            Element::EVENT_DEFINE_SIDEBAR_HTML,
            static function (DefineHtmlEvent $event) {
                Craft::debug(
                    'Entry::EVENT_DEFINE_SIDEBAR_HTML',
                    __METHOD__
                );

                Craft::$app->view->setTemplateMode(View::TEMPLATE_MODE_CP);
                $htmlText = Craft::$app->view->renderTemplate("netlifyhook/sidebar.twig", [
                    'hookUrl' => App::env('NETLIFY_BUILD_HOOK_URL')
                ]);
                $event->html .= $htmlText;
            }
        );
    }
}
