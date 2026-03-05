/**
 * --------------------------------------------------------------------------
 * weekend-bid-relaxer - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true, DECREASE_PERCENT: 30 };
function main() {
    var day = new Date().getDay();
    if (day === 6 || day === 0) {
        Logger.log("Weekend! Decreasing bids by " + CONFIG.DECREASE_PERCENT + "%");
    } else if (day === 1) {
        Logger.log("Monday! Restoring bids.");
    }
}
