export class PlayerStats {
    //Structure storing play stat details
    cardsNaturallyDrawn : number = 0; // Done
    cardsForceDrawn : number = 0; // Done
    cardsDiscarded : number = 0; // Done
    cardsPlayed : number = 0; // Done
    cardsReturnedToHand : number = 0;
    cardsAddedToDeck : number = 0;

    //spellsPlayed : number = 0;
    //spellDamage : number = 0;
    //spellHealing : number = 0;

    monstersPlayed : number = 0; // Done
    //monstersKilled : number = 0; //Difficult
    monstersLost: number = 0; //Done
    //Damage MY monsters have done
    monsterDamageDone : number = 0; //Done
    //Damage MY monsters have taken
    monsterDamageTaken : number = 0; //Done

    heroHealing : number = 0; // Done
    //armorApplied : number = 0;
    //Damage done to hero
    heroDamageTaken : number = 0; //Done
    //heroDamageDone : number = 0;
    //weaponseUsed : number = 0;
    fatigueDamageTaken : number = 0; // Done

    manaAvailable : number = 0; //Done
    manaUsed : number = 0; // Done
}