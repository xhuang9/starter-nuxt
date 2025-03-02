<?php

namespace modules\netlifyhook\services;

use Craft;
use craft\helpers\App;
use craft\helpers\StringHelper;
use Exception;

/**
 * NetlifyWebhookService provides static methods for validating and processing Netlify webhooks.
 */
class NetlifyWebhookService
{
    /**
     * Validates a Netlify webhook request by verifying the JWT signature and payload hash.
     * 
     * @param string $token The JWT token from the X-Webhook-Signature header
     * @param string $payload The raw request body
     * @return bool Whether the webhook request is valid
     */
    public static function validateWebhookRequest(string $token, string $payload): bool
    {
        if (empty($token)) {
            Craft::error(
                'Empty JWT token provided for verification',
                'netlify-hook'
            );
            return false;
        }
        
        $secret = App::env('NETLIFY_BUILD_HOOK_JWS_SECRET');
        if (empty($secret)) {
            Craft::error(
                'NETLIFY_BUILD_HOOK_JWS_SECRET environment variable is not set',
                'netlify-hook'
            );
            return false;
        }
        
        try {
            return self::verifyJwtToken($token, $payload, $secret);
        } catch (Exception $e) {
            Craft::error(
                'JWT verification error: ' . $e->getMessage(),
                'netlify-hook'
            );
            return false;
        }
    }
    
    /**
     * Verifies a JWT token's signature and payload hash.
     * 
     * @param string $token The JWT token
     * @param string $payload The raw request body
     * @param string $secret The secret key for verification
     * @return bool Whether the token is valid
     * @throws Exception If the token is invalid
     */
    private static function verifyJwtToken(string $token, string $payload, string $secret): bool
    {
        // Decode the JWT token
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            Craft::error(
                'Invalid JWT token format',
                'netlify-hook'
            );
            return false;
        }
        
        // Get the JWT header and payload
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $tokenParts;
        
        // Decode the header and payload
        $header = json_decode(self::base64UrlDecode($base64UrlHeader), true);
        $jwtPayload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // Verify the JWT issuer
        if (!self::verifyJwtIssuer($jwtPayload)) {
            return false;
        }
        
        // Verify the JWT algorithm
        if (!self::verifyJwtAlgorithm($header)) {
            return false;
        }
        
        // Verify the JWT signature
        if (!self::verifyJwtSignature($base64UrlHeader, $base64UrlPayload, $base64UrlSignature, $secret)) {
            return false;
        }
        
        // Verify the request body hash
        return self::verifyRequestBodyHash($jwtPayload, $payload);
    }
    
    /**
     * Verifies the JWT issuer is 'netlify'.
     * 
     * @param array $jwtPayload The decoded JWT payload
     * @return bool Whether the issuer is valid
     */
    private static function verifyJwtIssuer(array $jwtPayload): bool
    {
        if (!isset($jwtPayload['iss']) || $jwtPayload['iss'] !== 'netlify') {
            Craft::error(
                'Invalid JWT issuer: ' . ($jwtPayload['iss'] ?? 'not set'),
                'netlify-hook'
            );
            return false;
        }
        return true;
    }
    
    /**
     * Verifies the JWT algorithm is 'HS256'.
     * 
     * @param array $header The decoded JWT header
     * @return bool Whether the algorithm is valid
     */
    private static function verifyJwtAlgorithm(array $header): bool
    {
        if (!isset($header['alg']) || $header['alg'] !== 'HS256') {
            Craft::error(
                'Invalid JWT algorithm: ' . ($header['alg'] ?? 'not set'),
                'netlify-hook'
            );
            return false;
        }
        return true;
    }
    
    /**
     * Verifies the JWT signature.
     * 
     * @param string $base64UrlHeader The base64url-encoded JWT header
     * @param string $base64UrlPayload The base64url-encoded JWT payload
     * @param string $base64UrlSignature The base64url-encoded JWT signature
     * @param string $secret The secret key for verification
     * @return bool Whether the signature is valid
     */
    private static function verifyJwtSignature(string $base64UrlHeader, string $base64UrlPayload, string $base64UrlSignature, string $secret): bool
    {
        $signatureBase = $base64UrlHeader . '.' . $base64UrlPayload;
        $signature = hash_hmac('sha256', $signatureBase, $secret, true);
        $base64UrlCalculatedSignature = self::base64UrlEncode($signature);
        
        if ($base64UrlSignature !== $base64UrlCalculatedSignature) {
            Craft::error(
                'JWT signature verification failed',
                'netlify-hook'
            );
            return false;
        }
        
        return true;
    }
    
    /**
     * Verifies the request body hash matches the hash in the JWT payload.
     * 
     * @param array $jwtPayload The decoded JWT payload
     * @param string $requestBody The raw request body
     * @return bool Whether the hash is valid
     */
    private static function verifyRequestBodyHash(array $jwtPayload, string $requestBody): bool
    {
        // Extract the SHA256 hash from the JWT payload
        if (!isset($jwtPayload['sha256'])) {
            Craft::error(
                'JWT payload missing sha256 hash',
                'netlify-hook'
            );
            return false;
        }
        
        // Calculate the SHA256 hash of the request body
        $calculatedHash = hash('sha256', $requestBody);
        
        // Compare the hashes
        $result = $jwtPayload['sha256'] === $calculatedHash;
        
        if (!$result) {
            Craft::error(
                'Body hash verification failed. JWT hash: ' . StringHelper::first($jwtPayload['sha256'], 6) . '...' . 
                StringHelper::last($jwtPayload['sha256'], 6) . ', Calculated hash: ' . StringHelper::first($calculatedHash, 6) . '...' . 
                StringHelper::last($calculatedHash, 6),
                'netlify-hook'
            );
        }
        
        return $result;
    }
    
    /**
     * Decodes a base64url-encoded string.
     * 
     * @param string $input The base64url-encoded string
     * @return string The decoded string
     */
    public static function base64UrlDecode(string $input): string
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $input .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }
    
    /**
     * Encodes data to a base64url-encoded string.
     * 
     * @param string $input The data to encode
     * @return string The base64url-encoded string
     */
    public static function base64UrlEncode(string $input): string
    {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }
}
