import { Guild, MessageEmbed } from "discord.js";
import Box from "../class/box/Box";
import Map from "../class/map/Map";
import Player from "../class/player/Player";
import CookedFood from "../class/resource/CookedFood";
import Resource from "../class/resource/Resource";
import ShopItem from "../class/shop/ShopItem";
import Weapon from "../class/weapon/Weapon";
import box from "../commands/box";
import cook from "../commands/cook";
import playerEffects from "../static/playerEffectList";
import { rarities } from "../static/rarityList";
import { totalCommands } from "../types/commandFile";
import position from "../types/position";
import weaponType from "../types/weaponType";
import CanvasHelper from "./CanvasHelper";

export default class EmbedConstructor{
    

    public static help(): MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Commandes")
        var description = "Voici la liste des commandes disponibles\n\n"
        for(var i in totalCommands){
            description += "**"+totalCommands[i].command+"** : "+totalCommands[i].description+"\n"
        }
        embed.setDescription(description)
        return embed
    }
    
    public static notRegisterEmbed(type:"ME"|"OTHER"){
        var embed = new MessageEmbed()
        embed.setTitle("Non rengistré")
        embed.setDescription(type=="ME"?"Vous devez tout d'abord être enregistré sur le bot avec b!register.":"Cette personne doit être enregistrée sur le bot avec b!register")
        return embed
    }

    public static playerClan(player:Player):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.addField("Nom",player.clanPlayer.clan.name)
        embed.addField("Membres",player.clanPlayer.clan.getMembersText())
        return embed
    }

    public static playerNotInClan():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Vous n'êtes pas dans un clan. Vous pouvez en créer un en appuyant sur le bouton ci-dessous.")
        return embed
    }

    public static playerNotInClanWithoutCreation():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Vous n'êtes pas dans un clan. Vous pouvez en créer un en appuyant sur le bouton ci-dessous.")
        return embed
    }

    public static playerNotInSameClan():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Ce joueur n'est pas dans le même clan que vous, il n'est donc pas possible de l'exclure")
        return embed
    }

    public static clanCreationAskName():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Création clan")
        embed.setDescription("Envoyez dans votre prochain message le nom de votre clan")
        return embed
    }

    public static clanCreated(name:string):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Création clan")
        embed.setDescription("Le clan "+name+" a été créé avec succès")
        return embed
    }

    public static clanCreationFailed():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Création clan")
        embed.setDescription("Une erreur est survenue dans la création du clan, veuillez rééssayer")
        return embed
    }

    public static clanKickNotAuthorized():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Vous n'avez pas les droits nécessaires pour exclure un joueur du clan. (Nécessite le rôle leader ou admin)")
        return embed
    }

    public static clanCantKickYourself():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Vous ne pouvez pas vous exclure vous-même")
        return embed
    }

    public static clanKickSuccess():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Le joueur a bien été exclu du clan")
        return embed
    }

    public static clanKickFail():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Une erreur est survenue lors de l'exclusion du joueur du clan, veuillez rééssayer")
        return embed
    }

    
    public static playerAlreadyInClan(): MessageEmbed  {
        var embed = new MessageEmbed()
        embed.setTitle("Clan")
        embed.setDescription("Cette personne est déjà dans un clan. Vous ne pouvez donc pas l'inviter")
        return embed
    }

    public static clanInvitation(player:Player):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Invitation")
        embed.setDescription(player.discordUser.tag+" vous a invité à rejoindre le clan "+player.clanPlayer.clan.name+"\nVous pouvez accepter l'invitation en appuyant sur le bouton ci-dessous.")
        return embed
    }

    public static clanInvitationSent():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Invitation")
        embed.setDescription("L'invitation a bien été envoyée à l'utilisateur")
        return embed
    }

    public static clanInvitationAcceptedSuccess():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Invitation")
        embed.setDescription("Invitation acceptée avec succès ! Vous faites maintenant parti du clan")
        return embed
    }

    public static clanInvitationAcceptedFail():MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Invitation")
        embed.setDescription("Une erreur est survenue. L'invitation")
        return embed
    }

    public static async playerProfil(player:Player):Promise<MessageEmbed> {
        var embed = new MessageEmbed()
        embed.setTitle("Profil de "+player.discordUser.tag)
        var lifeStats = player.getLifeBarre()
        embed.addField("Stats vie",lifeStats.health+" "+player.data.lifeStats.health+" ❤️\n"+lifeStats.shield+" "+player.data.lifeStats.shield+" 🛡️\n")
        embed.addField("Argent",player.data.coins+" 💸")
        embed.addField("League",player.getLeagueText())
        var attackableData = player.isAttackable()
        embed.addField("Protection",attackableData.result?"Aucune protection":attackableData.reason+"( fin <t:"+Math.floor(attackableData.end/1000)+":R>)")
        var currentEffects = player.effects.filter(e=>e.end_time>Date.now())
        var effets = ""
        for (var i in currentEffects){
            effets += playerEffects.find(e=>e.id==currentEffects[i].effect_type).toString((currentEffects[i].end_time-Date.now())/1000,currentEffects[i].power)+"\n"
        }
        embed.addField("Effets",effets!=""?effets:"Aucun effet")
        var time = Date.now()
        embed.setImage(await CanvasHelper.generatePlayerProfil(player))
        console.log(time-Date.now())
       return embed;
    }

    public static killOrAssist(player:Player,deadPlayer:Player,coins:number):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Kill ou assist")
        embed.setDescription("Vous avez tué ou aidé à tuer le joueur: **"+deadPlayer.discordUser.tag+"**\nVous recevez donc "+coins+" 💸 pour un total de "+player.data.coins+" 💸")
        return embed;
    }

    public static dead(killer:Player, coins:number):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Mort")
        embed.setDescription("Vous avez été tué par le joueur **"+killer.discordUser.tag+"**\nVous avec perdu un total de "+coins+" 💸")
        return embed;
    }

    public static askWeapon(p:Player):MessageEmbed{
        var embed = EmbedConstructor.playerInventory(p)
        embed.setDescription("Choisissez l'arme à utiliser")
        return embed
    }


    public static weaponNotFound():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Arme non trouvée")
        embed.setDescription("Arme non trouvée dans la liste des armes")
        return embed
    }

    public static weaponNotFoundInInventory(weapon:weaponType):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Arme non trouvée dans l'inventaire")
        embed.setDescription("Arme ("+weapon.name.fr+") non trouvée dans votre inventaire")
        return embed
    }

    public static weaponUse(weapon:Weapon, message:string):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Arme utilisée")
        embed.setDescription("Vous utilisez l'arme: "+weapon.emoji+" "+weapon.name.fr+"\n\n"+message)
        return embed
    }

    public static respawnSuccess():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Respawn")
        embed.setDescription("Respawn effetué avec succès, bon retour dans le jeu!")
        return embed
    }

    public static respawnFailed():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Respawn")
        embed.setDescription("Vous ne pouvez pas respawn: vous n'êtes pas mort")
        return embed
    }

    public static needRespawn():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Non respawn")
        embed.setDescription("Vous devez respawn avec la commande b!respawn pour utiliser cette commande")
        return embed
    }

    public static needRegister():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Compte non créé")
        embed.setDescription("Vous devez créer un compte avec la commande b!register")
        return embed
    }

    public static playerInventory(p:Player):MessageEmbed{
        var data = Weapon.sortWeaponForInventory(p)
        var embed = new MessageEmbed()
        embed.setTitle("Inventaire")
        for (var i in rarities){
            var rarityText = ""
            for (var w of data[i].filter(weap=>weap.weapon.rarity.id==rarities[i].id)){
                rarityText += w.weapon.emoji+" "+w.weapon.name.fr+" x"+w.number+"\n"
            }
            if (rarityText == ""){
                rarityText = "Aucune arme"
            }
            embed.addField(rarities[i].emoji+" "+ rarities[i].name.fr,rarityText)
        }
        return embed
    }

    public static attackCooldown():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Cooldown")
        embed.setDescription("Vous ne pouvez pas attaquer car vous êtes actuellement sous cooldown (plus d'infos avec b!cooldown)")
        return embed
    }

    public static async waitMention(toMention:string,p:Player,server:Guild):Promise<MessageEmbed>{
        var embed = await EmbedConstructor.mapNearEnnemy(p,server)
        embed.setTitle("Cible requise")
        embed.setDescription("**Choisissez : "+toMention+"**\n\n"+embed.description)
        return embed
    }

    public static async mapNearEnnemy(p:Player,server:Guild):Promise<MessageEmbed>{
        var embed = new MessageEmbed()
        embed.setTitle("Joueur(s) à côté de vous")
        var opponents = await p.getAttackablePlayers(server)
        var opponentsList = ""
        for (var i in opponents){
            opponentsList+=((parseInt(i)+1)+" : "+opponents[i].discordUser.tag+" "+(!opponents[i].isAttackable?"🛡️":"")+"\n")
        }
        embed.setDescription(opponentsList)
        var imageBuffer = await Map.currentMap.createFromCoords(p.getRealPosition(),2,{playerLocation:p.getRealPosition(),opponents:opponents,pointers:p.data.movement?[{size:60,icon:"./static/images/map/run.png",pos:p.data.movement.position}]:undefined,showOpponentsNum:true})
        var imageURL = await Map.hostBuffer(imageBuffer)
        embed.setImage(imageURL)
        return embed
    }

    public static useCancel(reason:string):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Utilisation annulée")
        embed.setDescription("L'Utilisation a été annulée pour la raison suivante: "+reason)
        return embed
    }

    public static playerBoxes(p:Player):MessageEmbed{
        var data = p.box
        var embed = new MessageEmbed()
        embed.setTitle("Box")
        var finalDescription = ""
        for (var i in data){
            finalDescription+=(parseInt(i)+1)+". "+data[i].emoji+" "+data[i].name.fr+"\n"
        }
        embed.setDescription(finalDescription)
        return embed
    }

    public static boxOpened(w:Weapon,b:Box):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Box ouverte")
        var finalDescription = "Vous avez ouvert la box: **"+b.emoji+" "+b.name.fr+"** et avez obtenu:\n\n"
        finalDescription+=w.emoji+" "+w.name.fr+" de qualité "+w.rarity.emoji+" "+w.rarity.name.fr
        embed.setDescription(finalDescription)
        return embed
    }

    static boxesOpened(totalWeapons: Weapon[]): MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Box ouvertes")
        var finalDescription = "Vous avez ouvert toutes vos box et recevez:\n\n"
        for (var w of totalWeapons) {
            finalDescription += w.emoji + " " + w.name.fr + " de qualité " + w.rarity.emoji + " " + w.rarity.name.fr + "\n"
        }
        embed.setDescription(finalDescription)
        return embed
    }

    public static registerEmbed(type:number,data?:object):object{
        var embed = {}
        embed["title"] = "Inscription"
        if (type == 0){
            embed["description"] = "**__Raven__**:\n\"Bonjour et bienvenue sur BattleBot !\nJe suis Raven et je suis ici pour régler toute la paperasse avant de vous lancer sur l'ïle.\nOn y va ?\""
            embed["color"] = 1455351
        }
        if (type == 1){
            embed["description"] = "**__Raven__**:\n\"Parfait! Allons tout de suite du côté administratif...\nIl y a une charte à signer afin que tout le monde puisse jouer sans triche. Vous devez l'accepter avant de pouvoir commencer l'aventure.\nElle se trouve juste ici: INSERER LIEN ICI\n\nLa charte peut changer à tout moment donc n'hésitez pas à regarder le lien souvent.\""
            embed["color"] = 1455351
        }
        if (type == 2){
            embed["description"] = "**__Raven__**:\n\"Comme vous avez refusé la charte, vous ne pouvez pas participer à l'aventure BattleBot. N'hésitez pas à refaire la commande b!register et accepter la charte pour jouer!\nÀ une prochaine fois!\""
            embed["color"] = 1455351
        }
        if (type == 3){
            embed["description"] = "**__Raven__**:\n\"Super, j'ai tout ce qu'il me faut !\nVoici quelques petites infos pour finir: \n\nComme vous le savez peut-être, BattleBot est médiatisé. Nos présentateurs INSERER NOM ICI et INSERER UN AUTRE NOM ICI font vivre tout ce qu'il se passe sur l'ïle de BattleBot à travers le monde.\nTout ce qu'il s'est passé d'important pendant une journée est donc envoyé sur le serveur support de BattleBot.\n\nNous allons vous fournir aussi un 🤖 \"Lixo\". C'est un robot permettant de vous expliquer comment tout marche sur BattleBot avec l'aide de tutoriels. Il sera disponible lors de votre arrivée sur l'ïle.\n\nVoilà c'est tout ce que j'ai à dire... Un vaisseau de transport est maintenant disponible, vous allez pouvoir débarquer sur l'ïle.\nBonne chance de toute l'équipe de BattleBot !\""
            embed["color"] = 1455351
        }
        if (type == 4){
            embed["title"] = "Annonce"
            embed["description"] = "**__INSERER NOM ICI__**:\n\"Attention tout le monde, un nouveau challenger vient d'entrer sur l'ïle. Accueillez chaleureusement <@"+data["id"]+"> !\""
            embed["color"] = 16678913
            embed["thumbnail"] = {"url":"https://cdn.discordapp.com/attachments/839604520245264404/850845362133663744/Megaphone.png"}
        }
        if (type == 5){
            embed["title"] = "Arrivée sur l'ile"
            embed["description"] = "Vous êtes arrivé sur l'ile en position: **"+data["pos"].x+" ; "+data["pos"].y+"**"
            embed["color"] = 1455351,
            embed["thumbnail"] = "https://cdn.discordapp.com/attachments/840535209723953172/854015410785484830/PointeurFinal.png"
        }
        return embed;
    }

    public static async mapEmbed(p:Player,attackablePlayers?:Array<Player>){
        var embed = new MessageEmbed()
        embed.setTitle("Map")
        var realPos = p.getRealPosition()
        if (p.data.movement!=undefined){
            embed.setDescription("Votre position: "+realPos.x+" ; "+realPos.y+".\nVous vous déplacez actuellement vers : "+p.data.movement.position.x+" ; "+p.data.movement.position.y+". Vous y arriverez "+p.getTimeLeft())
        }else{
            embed.setDescription("Votre position: "+realPos.x+" ; "+realPos.y)
        }
        var mapLocation = Map.currentMap.getLocationFromCoords(realPos)
        if (mapLocation){
            embed.setDescription(embed.description+"\nActuellement dans "+mapLocation.name)
        }
            var imageBuffer = await Map.currentMap.createFromCoords(realPos,2,{playerLocation:realPos,opponents:attackablePlayers,pointers:p.data.movement?[{size:60,icon:"./static/images/map/run.png",pos:p.data.movement.position,}]:undefined,drops:p.visibleDrop(p.lastChannel.guild.id)})
            var imageURL = await Map.hostBuffer(imageBuffer)
            embed.setImage(imageURL)
        return embed
    }

    public static async mapMoveEmbed(p:Player, pos:position,zoom:number,opponents?:Array<Player>){
        var embed = new MessageEmbed()
        embed.setTitle("Map - Déplacement")
        embed.setDescription("Votre position: "+p.getRealPosition().x+" ; "+p.getRealPosition().y+"\nPosition de la caméra: "+pos.x+" ; "+pos.y)
        
            console.log(p.visibleDrop(p.lastChannel.guild.id))
            var originalDate = Date.now()
            var imageBuffer = await Map.currentMap.createFromCoords(pos,zoom,{playerLocation:p.getRealPosition(),opponents:opponents,pointers:p.data.movement?[{size:60,icon:"./static/images/map/run.png",pos:p.data.movement.position}]:undefined,drops:p.visibleDrop(p.lastChannel.guild.id)})
            console.log(Date.now()-originalDate)
            var imageURL = await Map.hostBuffer(imageBuffer)
            console.log(Date.now()-originalDate)
            embed.setImage(imageURL)
        return embed
    }

    public static shopEmbed():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Boutique")
        var embedDesc = "\"Bienvenue dans mon shop\nVendre des boxs, c'est ma spécialité. Nous faisons même la livraison sur l'île.\"\n- Gavin\n\n"
        for (var i in ShopItem.shop){
            embedDesc+=ShopItem.shop[i].getItemString()+" : "+ShopItem.shop[i].price+" 💸\n"
        }
        embed.setDescription(embedDesc)
        return embed
    }

    public static shopItem(item:ShopItem):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Boutique")
        var embedDesc = "Item choisi : "+item.getItemString()+"\nTemps de drop : "+item.dropTime+" secondes\nPrix : "+item.price+"\n\nChoisissez le nombre de box que vous voulez acheter"
        embed.setDescription(embedDesc)
        return embed
    }


    public static tutorialEmbed(data:{"title":string,"content":string,"image"?:string}){
        var embed = new MessageEmbed()
        embed.setTitle(data.title)
        embed.setDescription(data.content+"\n\n- Lixo")
        embed.setImage(data.image)
        return embed
    }

    public static validationShopPurchase(item:ShopItem,number:number){
        var embed = new MessageEmbed()
        embed.setTitle("Confirmation d'achat")
        embed.setDescription("Êtes-vous sûr de vouloir acheter : x"+number+" "+item.getItemString()+"\nPour un total de : "+item.price*number+" 💸 ?\nCe drop arrivera <t:"+(Math.floor(Date.now()/1000)+item.dropTime*number)+":R>")
        return embed
    }

    public static purchaseSuccess(time){
        var embed = new MessageEmbed()
        embed.setTitle("Achat effectué avec succès")
        embed.setDescription("On vient d'accepter ton achat. Ton matos est dans un <:drop:882339154510352445> drop qui arrivera <t:"+(Math.floor(Date.now()/1000)+time)+":R> sur l'île")
        return embed
    }

    public static cancelledPurchase(item:ShopItem,number:number){
        var embed = new MessageEmbed()
        embed.setTitle("Achat annulé")
        embed.setDescription("Votre achat a bien été annulé")
        return embed
    }

    public static notEnoughCoinsShop(item:ShopItem,number:number){
        var embed = new MessageEmbed()
        embed.setTitle("Achat annulé")
        embed.setDescription("Vous n'avez pas assez d'argent pour acheter : x"+number+" "+item.getItemString()+"\n\n")
        return embed
    }

    public static hourlyGot(number:number){
        var embed = new MessageEmbed()
        embed.setTitle("Hourly reçu")
        embed.setDescription("Vous avez reçu un total de "+number+"💸")
        return embed
    }

    public static hourlyCooldown(){
        var embed = new MessageEmbed()
        embed.setTitle("Hourly sous cooldown")
        embed.setDescription("Vous êtes actuellement sous cooldown pour cette commande (/cooldown ou b!cooldown pour plus d'infos)")
        return embed
    }

    public static cooldownsCoomand(p:Player){
        var allCooldowns:Array<{title:string,type:cooldownType}> = [{"title":"Bouclier","type":"SHIELD"},{"title":"Attaque","type":"ATTACK"},{"title":"Hourly","type":"HOURLY"},{"title":"Search","type":"SEARCH"}]
        var embed = new MessageEmbed()
        embed.setTitle("Cooldowns")
        for (var i in allCooldowns){
            console.log(p.hasCooldown(allCooldowns[i].type))
            embed.addField(allCooldowns[i].title,p.hasCooldown(allCooldowns[i].type).result?"<t:"+Math.floor(p.hasCooldown(allCooldowns[i].type).end/1000)+":R>":"Prêt")
        }
        return embed
    }

    public static searchDone(str:string){
        var embed = new MessageEmbed()
        embed.setTitle("Recherche terminée")
        embed.setDescription("Vous avez reçu :\n\n"+str)
        return embed
    }

    public static searchOnCooldown(str:string){
        var embed = new MessageEmbed()
        embed.setTitle("Recherche sous cooldown")
        embed.setDescription("Vous êtes actuellement sous cooldown pour cette commande")
        return embed
    }

    public static playerResources(player:Player){
        var embed = new MessageEmbed()
        embed.setTitle("Ressources")
        var data = Resource.sortResourceForInventory(player)
        for (var i in rarities){
            var rarityText = ""
            for (var r of data[i].filter(res=>res.resource.rarity.id==rarities[i].id)){
                rarityText += r.resource.emoji+" "+r.resource.name.fr+" x"+r.number+"\n"
            }
            if (rarityText == ""){
                rarityText = "Aucune ressource"
            }
            embed.addField(rarities[i].emoji+" "+ rarities[i].name.fr,rarityText)
        }
        return embed
    }

    public static playerResourcesToCook(resourcesSelected:Array<Resource>,resourcesAvailable:Array<Resource>){
        var embed = new MessageEmbed()
        embed.setTitle("Cuisine")
        if (resourcesSelected.length==0){
            embed.addField("Ressources sélectionnées (0/5)","Aucune ressource sélectionnée")
        }else{
            var selectedData = Resource.sortResourceForCookSelection(resourcesSelected)
            var weaponsText = ""
            for (var r of selectedData){
                weaponsText += r.resource.emoji+" "+r.resource.name.fr+" x"+r.number+"\n"
            }
            embed.addField("Ressources sélectionnées ("+resourcesSelected.length+"/5)",weaponsText)
        }
        if (resourcesAvailable.length==0){
            embed.addField("Ressources disponible","Aucune ressource disponible")
        }else{
            var availableData = Resource.sortResourceForCookSelection(resourcesAvailable)
            var weaponsText = ""
            for (var r of availableData){
                weaponsText += r.resource.emoji+" "+r.resource.name.fr+" x"+r.number+"\n"
            }
            embed.addField("Ressources disponible",weaponsText)
        }
        return embed
    }

    public static cookCancel(){
        var embed = new MessageEmbed()
        embed.setTitle("Cuisine")
        embed.setDescription("Commande annulée")
        return embed
    }

    public static currentlyCooking(){
        var embed = new MessageEmbed()
        embed.setTitle("Cuisine")
        embed.setDescription("Cuisine en cours...")
        return embed
    }

    public static cookingEnded(cookedFood:CookedFood){
        var embed = new MessageEmbed()
        embed.setTitle("Cuisine terminée")
        embed.setDescription("Vous venez de cuisiner : \n\n"+cookedFood.name.fr)
        var health = cookedFood.bonus.health
        var shield = cookedFood.bonus.shield
        for (var i in cookedFood.resources){
            health+=cookedFood.resources[i].bonus.health
            shield+=cookedFood.resources[i].bonus.shield
        }
        embed.addField("Soins",health+"❤️ "+shield+"🛡️")
        embed.addField("Effets",cookedFood.getEffects()!=""?cookedFood.getEffects():"Aucun effet")
        return embed
    }


    public static playerCookedFoods(player:Player){
        var embed = new MessageEmbed()
        embed.setTitle("Plats cuisinés")
        var description = ""
        var data = player.cookedFoods
        for (var i in data){
            description+=data[i].name.fr+" ("+data[i].getHealingBonus()+")"+data[i].getEffects()+"\n"
        }
        embed.setDescription(description)
        return embed
    }

    public static selectFoodToEat(player:Player){
        var embed = new MessageEmbed()
        embed.setTitle("Plats cuisinés")
        var description = "Choisissez un plat à manger\n\n"
        var data = player.cookedFoods
        for (var i in data){
            description+=data[i].name.fr+" ("+data[i].getHealingBonus()+")"+data[i].getEffects()+"\n"
        }
        embed.setDescription(description)
        return embed
    }

    public static cookedFoodEaten(cookedFood:CookedFood){
        var embed = new MessageEmbed()
        embed.setTitle("Plat mangé")
        embed.setDescription("Plat mangé avec succès !\n\nVous avez reçu "+cookedFood.getHealingBonus())
        return embed
    }

    public static noFoodToEat(){
        var embed = new MessageEmbed()
        embed.setTitle("Aucun plat")
        embed.setDescription("Vous n'avez pas de plats dans votre inventaire")
        return embed
    }

    public static weaponInfo(weapon:weaponType){
        var embed = new MessageEmbed()
        embed.setTitle("Info arme")
        embed.setDescription("Information de l'arme "+weapon.name.fr)
        embed.addField("Rareté",rarities.find(r=>r.id==weapon.rarity).emoji+" "+rarities.find(r=>r.id==weapon.rarity).name.fr,true)
        embed.addField("Description",weapon.info.description,true)
        embed.addField("Utilisation",weapon.info.use,false)
        return embed
    }

    public static weaponInfoNotFound(){
        var embed = new MessageEmbed()
        embed.setTitle("Arme non trouvée")
        embed.setDescription("L'arme n'a pas été trouvée")
        return embed
    }
    

    
    
}