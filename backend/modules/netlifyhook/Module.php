<?php
namespace modules\netlifyhook;

use Craft;
use craft\helpers\App;
use craft\base\Element;
use craft\events\DefineHtmlEvent;
use craft\elements\Entry;
use craft\events\RegisterTemplateRootsEvent;
use craft\web\View;
use yii\base\Event;

class Module extends \yii\base\Module
{

    const NETLIFY_HOOK_MODULE_PATH = __DIR__;

    public function init()
    {
        // Set a @modules alias pointed to the modules/ directory
        Craft::setAlias('@modules', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (!Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'modules\\netlifyhook\\controllers';
        }

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
