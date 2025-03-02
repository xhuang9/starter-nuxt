<?php

namespace modules\netlifyhook\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;
use yii\base\InvalidConfigException;
use modules\netlifyhook\services\NetlifyWebhookService;
use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;

class BuildController extends Controller
{
    const CACHE_PATH = __DIR__ . "/../cache/netlify.json";
    protected array|bool|int $allowAnonymous = true;

    public function beforeAction($action): bool
    {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    /**
     * @return Response
     * @throws InvalidConfigException|ForbiddenHttpException
     */
    public function actionUpdate():Response
    {
        // Verify the Netlify signature
        $signature = Craft::$app->getRequest()->getHeaders()->get('X-Webhook-Signature');
        $rawBody = Craft::$app->getRequest()->getRawBody();
        
        // Check for missing signature
        if (!$signature) {
            Craft::error(
                'Missing webhook signature in request',
                'netlify-hook'
            );
        }
        
        // Validate the webhook request using the service
        if (!NetlifyWebhookService::validateWebhookRequest($signature, $rawBody)) {
            Craft::error(
                'Invalid webhook signature detected from IP: ' . Craft::$app->getRequest()->getUserIP(),
                'netlify-hook'
            );
            throw new ForbiddenHttpException('Invalid webhook signature');
        }
        
        $data = Craft::$app->getRequest()->getBodyParams();
        if(empty($data)){
            $data = json_decode($rawBody, true);
        }
        
        // Validate and sanitize the build state
        if (isset($data['state'])) {
            // Only allow valid build states: building, ready, failed
            $validStates = ['building', 'ready', 'failed'];
            
            // Strip out any non-matching characters and ensure lowercase
            $state = strtolower(preg_replace('/[^a-zA-Z]/', '', $data['state']));
            
            // Check if the sanitized state is valid
            if (in_array($state, $validStates)) {
                $data['state'] = $state;
            } else {
                // Default to 'ready' if state is invalid
                $data['state'] = 'ready';
                Craft::warning(
                    'Invalid build state received: "' . $data['state'] . '", defaulting to "ready"',
                    'netlify-hook'
                );
            }
        }
        
        $this->setCache(json_encode($data));
        return $this->asJson("success");
    }
    
    public function actionCheck():Response {
        return $this->asJson($this->getCache());
    }

    private function getCache():array|string
    {
        if(!file_exists(self::CACHE_PATH)){
            return ["not exist"];
        }
        
        return json_decode(file_get_contents(self::CACHE_PATH), true) ?? ["empty"];
    }

    private function setCache(string $data):void
    {
        //check CACHE_PATH exists, if not create the folder and set correct permission
        if(!file_exists(dirname(self::CACHE_PATH))){
            mkdir(dirname(self::CACHE_PATH), 0775, true);
        }
        
        $result = file_put_contents(self::CACHE_PATH, $data);
        if ($result === false) {
            Craft::error(
                'Failed to write Netlify build status to cache file: ' . self::CACHE_PATH,
                'netlify-hook'
            );
        }
    }
}
