# DropThoughts

Gotta give the credit. What can I say? 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

The ultimate social networking app designed to share your thoughts with your closest friends and loved ones like never before. 
Can't express your thoughts with words? Heck, add an image too. 
Wanna leave a comment on someone's thought? Do it. You can. 
Did a thought or a comment touch your hear? Hit the like and find all fav thoughts in your profile. 
Search for the profiles and thoughts. 
Check your activity page to see who loved or left a reply to your thought. 

Did you like someone else's thought and wanna share it as it is? Just "re-post". Easy. 
Wanna share a post with your friend or fam? Hit share and choose the option available. There is plenty. 
Follow loved ones, friends, and famous thought-sharers. Or unfollow if you are bored. 


Please sign up with your email or google account, go through the app, and let me know if there are any critical bugs. 

Currently working on: 
- thought images 
    - image in a new thought 
    - image in a comment of a thought 
    - image in a thought card 
- re-posting a thought  
    - with username
- allow deleting thoughts including: 
    - removal of the thought from the likes table 
    - removal of the thought from the user's liked thoughts  
    - removal of the thought from the users created thoughts 
- sharing thoughts: fontawesome icons 
    - copy link 
    - copy thought without the image  
    - whatsapp link 
    - instagram link 
    - twitter link 
    - threads link
- following other users 
    - following list 
    - followers list 
- un/archiving thoughts 
    - add archived flag property to a thought 
    - archived thoughts list
    - add to archived thoughts list, remove from the thoughts list, and add archived flag 
    - remove from the archived thoughts list, add to the thoughts list, and remove the archived flag
- blocking other users
    - block users and add them to blocked users list 
    - do it for the other side too 
    - hide posts from the blocked users   
- infinite scroll or pagination 
    - fetch 5-10 inital thoughts, and fetch the rest on infinite scroll 
    - do this for all thoughts, blocked users, active users
- tagging other users in thoughts 
    - check if there are spaces before and after the username tag in a thought 
    - notify the user about them being having been tagged  

Additional bug fixes and UI improvements:
    - remove the three-dot-menu from non-authors' view 


BTW, thanks to [Vercel](https://vercel.com/), you can see the deployed app [here](). 