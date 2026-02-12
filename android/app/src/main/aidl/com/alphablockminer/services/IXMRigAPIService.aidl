// IXMRigAPIService.aidl
package com.alphablockminer.services;

interface IXMRigAPIService {
    void startSummaryUpdates();
    void stopSummaryUpdates();
    void pauseMiner();
    void resumeMiner();
}
