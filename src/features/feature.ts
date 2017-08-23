/**
 * Abstract robot capability.
 */

/*
 * AetheBot - A Discord Chatbot
 * 
 * Created by Tyrone Trevorrow on 03/02/17.
 * Copyright (c) 2017 Tyrone Trevorrow. All rights reserved.
 * 
 * This source code is licensed under the permissive MIT license.
 */

import * as Discord from "discord.js"
import {Bot} from "../bot"

export abstract class Feature {
    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot
    }
    
    abstract handleMessage(message: Discord.Message): boolean

    handlesMessage(message: Discord.Message): boolean {
        // Ignore messages send by the bot itself
        if (message.author.equals(this.bot.user)) {
            return false
        }
        // Handle all DMs by default
        if (message.channel.type === 'dm') {
            return true
        }
        // Handle messages where the bot is specifically mentioned
        if (message.isMentioned(this.bot.user)) {
            return true
        }
        return false
    }

    commandTokens(message: Discord.Message): string[] {
        let tokens = message.content.split(" ")
        
        // Remove the mention
        if (message.isMentioned(this.bot.user)) {
            tokens.splice(tokens.findIndex((s) => s === `<@${this.bot.user.id}>`), 1)
        }
        return tokens
    }

    replyWith(message: Discord.Message, replyStr: string): Promise<Discord.Message | Discord.Message[]> {
        const chan = message.channel
        if (message.channel.type === 'dm') {
            return chan.sendMessage(replyStr)
        } else {
            return chan.sendMessage(`<@${message.author.id}> ${replyStr}`)
        }
    }
}
