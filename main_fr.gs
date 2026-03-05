/**
 * --------------------------------------------------------------------------
 * weekend-bid-relaxer - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Auteur : Thibault Fayol - Consultant SEA PME
 * Site web : https://thibaultfayol.com
 * Licence : MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  DECREASE_BID_PERCENT: 50, // -50% during weekends
  LABEL_TAG: "Weekend_Relaxed"
};
function main() {
  var day = new Date().getDay(); // 0 is Sunday, 6 is Saturday
  var isWeekend = (day === 0 || day === 6);
  
  if (!CONFIG.TEST_MODE) createLabelIfNeeded(CONFIG.LABEL_TAG);
  
  var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
  var multiplier = isWeekend ? (100 - CONFIG.DECREASE_BID_PERCENT) / 100 : 1.0;
  
  while(campIter.hasNext()) {
      var camp = campIter.next();
      var currentMod = camp.bidding().getBidModifier() || 1.0;
      
      if (isWeekend) {
          if (currentMod > multiplier) { // Decrease
             Logger.log("Baisse de l'enchère pour " + camp.getName());
             if (!CONFIG.TEST_MODE) { camp.bidding().setBidModifier(multiplier); camp.applyLabel(CONFIG.LABEL_TAG); }
          }
      } else {
          // It's a weekday. Restore exactly to 1.0 if it was tagged.
          var labelIter = camp.labels().withCondition("Name = '" + CONFIG.LABEL_TAG + "'").get();
          if (labelIter.hasNext()) {
              Logger.log("Restoring bid for " + camp.getName());
              if (!CONFIG.TEST_MODE) { camp.bidding().setBidModifier(1.0); camp.removeLabel(CONFIG.LABEL_TAG); }
          }
      }
  }
}
function createLabelIfNeeded(name) { if (!AdsApp.labels().withCondition("Name = '" + name + "'").get().hasNext()) { AdsApp.createLabel(name); } }