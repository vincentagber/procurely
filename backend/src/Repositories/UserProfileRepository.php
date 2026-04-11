<?php

namespace Procurely\Api\Repositories;

/**
 * Repository for User Profiles and Preferences
 */
class UserProfileRepository extends BaseRepository
{
    public function findByUserId(int $userId): ?array
    {
        return $this->fetchOne('user_profiles', 'user_id', $userId);
    }

    public function upsert(int $userId, array $data): bool
    {
        $sql = "INSERT INTO user_profiles (user_id, preferences, purchase_history, settings, phone, address) 
                VALUES (:user_id, :prefs, :history, :settings, :phone, :address)
                ON DUPLICATE KEY UPDATE 
                    preferences = VALUES(preferences),
                    purchase_history = VALUES(purchase_history),
                    settings = VALUES(settings),
                    phone = VALUES(phone),
                    address = VALUES(address)";
        
        $this->execute($sql, [
            'user_id' => $userId,
            'prefs' => json_encode($data['preferences'] ?? []),
            'history' => json_encode($data['purchase_history'] ?? []),
            'settings' => json_encode($data['settings'] ?? []),
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        return true;
    }
}
