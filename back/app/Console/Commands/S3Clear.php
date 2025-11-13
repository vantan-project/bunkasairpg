<?php

namespace App\Console\Commands;

use App\Models\Item;
use App\Models\Monster;
use App\Models\Weapon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class S3Clear extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 's3:clear';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Command description';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $keepUrls = [
      // ヒール
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/tScxu7ni1MSflYYtuzjhVInNAAa5xI1kn1Q2Nhny.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/pr05Vx0ZNCFTTjl4JJIba9wYstGBPozMTx7ttKpW.png",
      // バフ
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/9w0VkKHoJoMDFyMsvmKPUFGQ6VuCwEZ9yRD26U2G.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/yMx2aBcf3pH7Rau3ov6iGHCSdFfeidroGu8hXzRh.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/VccDyJY07F97diGqTrnNhNl1vHwtICR5lOzGtWky.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/KrcQuGTtVSXU8orDMq34jwLdIsmMwx66Zk1DALxM.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/7oGyk3THvXOSBlW9z3fs8IMTLQeaMLslmx2dbkSg.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/jIGRcDIvk5yas1CADmAbeMdv151RQlrjFWsNjrhh.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/YRBGLNRIjVBAMAG3EHCIyBHsaTrbm0lWMNyU2u1n.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/VcQrEmZDhze9gC6Lv6wpWoO2ZCHjMgoZF5FTBVyQ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/m6Y0u7efE0zp8pDJbx3IzrgBYDy96LTzIyweZMcI.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/rt1O4b4YtJ6kCvL1vEDIaHGu5e2ZLTbpEBGvRIpf.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/3mmrxG8b4kWQBJ5gfyMX6HSRO3I05igCutzp8hjy.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/ON2Rs3Dn8tTq1hb0q4uxQHaGPpDVhcJ779XEwASY.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/MdtvGwHqnbIJ5CGQO3gD9g7kbSG60PyLkM3DM47q.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/lrPeLGOMg5FuLGnj8WxkU57XYBnWGBv2IPs5Vp7D.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/FgqzUsbTxC2esh9bTLyMpNa1bXq72H3LG827OgOL.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/UKABzAMVLkfoO2uGLdxd3eZ1bpOwfDVKvKHLwlKR.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/pHHIu8lOamBuV1UI6piwsLGCirGcSwur5oDRhzI2.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/gvPGxGwgaRdKmoJxvVjllarOsdtyEZAuBTmki4T0.png",
      // デバフ
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/63w6Q9sky21e4e2uSFz67qCUChxvbYmxa83JfMWV.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/wlSI0KJK3PKReauUFpcb89okI2bnkzrPeNbxLekl.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/mx8J3OSglP6T9ZiTVYpJx2xWFDbgEmnAOi6B0OV6.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/4NHM4J3rfDKQhsPxh8LG5JJTdJ7QTlJ0qjHc7JAC.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/n2p2Rhse4NF99eqlLHXHfIdNPlSpjW1Mo8rFax0K.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/AqeCBHjGOBf056usvpHonQVBTnWGioTrSv4GXtTO.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/7JeHeHTiurX1B0FXE7FHCDVWIJr5xc5GazLFhQv8.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/ce5sz16BU1JKo0yvS82X7XIeg9XE1BcDQm6yG1Jp.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/mg6LudiIIb8EYTAjXf9EtDjHTZV2Lm5fbTETfeKG.png",

      // スライム
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/SCLq6q85F2PEC3qBAvOiVaP7UogUNiw4taT7cVNE.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/u7cZqONnZYe3lNZbImCTARYv2sMngAtrKbYvRJMF.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/l88jUP6Ap5NLdWnOk4HtmpeDzbaBMB2mFXkqsIX6.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/kTzv9zyTPkQ5fKPvzzBIdJpXlp7EGegzqT6WbUtD.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/Ydze0M46z8lcw64Aco605d8ESCfNm86Jr502YG9W.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/H6w76Ll7PAVWo545SS5s8qcMB0vTCT2hHK7xgPmv.png",
      // デビルン
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/LxRxmHVEBSx9t4SsvMe5d6HBqe2Ts1ITWM62oj3h.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/iV5sOJlt6xR4QetBbuRjs1g2kq8FtvQxAS49j6Ep.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/TXIAOpXs5uV364cjwVsVWOQwxt6MMfY59sFglQaE.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/5Hfgs9gFc9bgavUixOx0DRJ7iWS4RLQGsaZtYu5E.png",
      //　マグ
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/4T1ln5q2dCWgkq9vmrb1AmKbfsgFA1nTLdanhmXA.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/PFijM2Bob3920fytEid4WCRNDdItTnIQUckRLuLg.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/bXiBVCMrUKFH9XH67h0Xm2W7BEwlL51xyZBc7eDm.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/SYNhxDGdq5gRPi6vLT5qcJ4hK2urfv0S29BHEMHC.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/XyQ8vVsDeVVrG5IaVzH9apq8CjjcHdtpQCRLaYiD.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/LSrkp4CBeemuSRhfVljWEga3xy612aZRXbn9ntWj.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/PhudMUKJKwifU9TijhHm9gtGsaD61uMREc9kKVDZ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/owBv2Gx9L2XT9DFeV4aMuFAPz5FjnL49D1eeZ94V.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/4czqYnprhd9yJxiIYg1vpt9GJYve7XhaqGOXVdtE.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/INhw2ISLnhdy8lvZnRTBdhSzPPriS55F2NANTDLm.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/SaXK1flnQs17J5q5UyFnjcMSEu5wzPjWCbP9i41b.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/3fgTxn1HnnlIxG7RHen4E4lhkytS1lvWjvD99kQV.png",
      // ロン
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/8Ye1Dn6JyS9FVbPjVme6KSBiLNDkZSMCpSVE3QiZ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/SjRCQvtIyQmMNKwqfSOECUSvv8368ngJo6ioa1qY.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/uXVJlBdPTPa1ZO1nJnLdZe3X93ZbdjofBbgrPN4t.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/BQCBsSAbKxIBiByDt6kMH6DtkNeS4OSuxMhybGwe.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/6HUExVxnAD6toNnYaWOLQqA91MaSwoDS1PnPgfIw.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/N5Q000ThsyHZYLlBcXpKePfmf8uxfAqJh4xkjBR5.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/8q0tggeNmh3hFWgr8Bw9fl1N6uABySi0Nbef9iEZ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/DFErzhy1gVdh73vli06MTaG9rV77ADAUXhChwsVK.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/6kt3H6MVJM6IHKaIepkDBGaMuxmEpLcGHv2BZ826.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/tV1ZeezujE3QcHprBDVEC89caeDfk5U6BSOdS7Ge.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/CgQ7OUjJ1CPYqXQ3tBZ7TEZsN7Fsc1rEdc6KPwuF.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/FMcIa3j3JeOHFGyT7Jo37RRW4aVRKy1metWZbeVh.png",
      // ゴルド
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/98piOlHMGBPyG3rtwsh7aYTzuy4qlGputhw0op8D.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/pqku43mdu9q2zugJmMdSor3nhjHw3LEVfRkpCEau.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/sE2XVh7Hixlol6sbDAhW8PIt6SNDzwFeOlrUHQKL.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/Ez7GMvNrJwFJQ1gvqOgO58ZYFzfItXM8NtneabUn.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/OVgUPMcGi5GijZWFF2yjiCXyXNaDi9YGOZbexjgX.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/NgAWTw8TFO57BIx6TUBma8nvoWibbqG6vn5Q0kvq.png",
      // ウィザード
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/eC8Yj7H5kUuS8flJhsUGuZzMBVFOAeINP2paeehC.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/3xiG7WMSxiKrNNj6YGm723GUkn42w2PZWIIJpquB.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/LH4xZk8PHZEkRgswnORcvwoBmZpn3Vwocfj8xi5U.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/2sG32fjWGoyuFZ7YM5WOz51bRo4NYpEdyOF6x0zN.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/jf54fvzECaITiUJLyXY6ZqwrifiLLAXOBx1Z9B9F.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/3iFDAJ4mKtoIIcxOCSaVubmKAPMqzSoAWuK5nOzn.png",
      // スカル
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/2evhp330Mmi9LaYtXadCXCEvRuVsxsokVTecEwQs.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/0rz3vH57uC05ps4NmCfWzwrNiKR6DMkbiUbEvdfg.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/lkukaxc1ccho7PlUdcO927pOdE7uhinVokp41Hej.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/JjAI1KPefZJ1ynOl6Hrb0EzMZnwNT4ZUPgE6sTe7.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/K1Mb1TUxLCGmZY9a6PAiO78mO531Z6Wf1zOQFVZp.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/OluTxI9PrmHrpyIOnqlbF67liRG3NhamjLSLhKoU.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/vBsmtbVJUqVlMfF8adIRhItHePUA5ntNExTLoZHo.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/5DEX860wBTk6d79DsZYJYkfrwf6qT1sJe9cYaVVH.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/gxj9Yk2If9r7Hq6YkkoP4IKtTLCQhZS8SCnjQsvo.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/8VMwbIw4xmX3YZJHeiYgRvEcEVoqTdtueRh43Wcn.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/h24bPjEjxchJmFi1qCAK2X9rGXrGy0XacBe1D7sh.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/w8dA31Iqc1BvNqObgYyAYX67gQZ7dXBYYk3VyF7f.png",
      // シャークマン
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/kcnoksrkjkTc4lGcS3DKJNvl5cpaJnXdrfedrVoK.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/zYZ2mb61ZkVrIwjdIFWSbwOINAwciG24Dx2maPUV.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/18nDTaQ7Tl6zBqVzeEoScpaMbFRwsD2YdEmvVyyF.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/2pxFhlDmfiRUvZhtlPO4YIdURqxhHl3Tb8mLYU7h.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/jPN6cEc3ZcezTDr2OdFCarvVwb13YOjSigH6v7Vf.png",
      // クラブ
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/ZM8gi7ZIL5Co4lyQTPDCdPY5fxOGfzg5uyaijUWz.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/IAEz9KwyKz947uuQFBEmKZGvexNclZUh875l68QZ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/6P70BPa3GmI1hItoP5r03BcBc08s4As0XEdCuAeb.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/N4PTvR5DjkSBdKvfdnpT91NL2CIN5nidLsjF6B67.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/YU7WdgwaaZzctWLbr1o82JLV5NkhZcjLnD3W5hcm.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/qwN22Cgnm1CzDi7npGIaBrJD9e40MKZ7BCeUzXnD.png",
      // イノセント
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/4dz064oJuRP7Y9ja8MPHpmOmSgGfFEaAbXNAuptY.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/tmPFkWYLmQdjOTRMYHshahist4CYip5wazuBw3QM.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/0Sj8sM3ewjvyJhAUDkCZnsdMLheyiI2BQ44iuz2M.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/5lkd4hJNns4ecjWFtEwyQfmXkJa13pGSnT1z77r5.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/zC5Ft0MejWvDr6nZADSIFkFeuYlKJ84GstQ1n7r7.png",
      // オーガ
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/xDTqOy9jyhAUZ6RGxMrOzRG5keQtMMY8l29B4eYd.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/DGM7q90xEckRa3lRwbKGSneSOhG9IjavT26Kxu9o.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/0Fy93iSYRQeizN8c9wPOZ96KftpAsKwU4cAfJMDh.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/vWffcasSZesfHuzT8wW9ykmCGAd5TzmOSCEk1LWd.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/zSbivCzcHZfrZLsxCDHWpElFK6EWoslA0hasMuLH.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/8FlFOiBltOiG91fdfjE6pArogfl9YMWjuV4rQnjq.png",
      // イノセント ガン 
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/DC8N6NnkTWtQbzlg3pVxsgAc8lgIAGtllwH2jMkF.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/B4UMKH0F0basevYxVjRUCsBiLAr02wnLWvcpj7ZG.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/nvuFOAe7ZN7sQE66dUyF9ldopOodCFdVgBb4U1jF.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/FtUjVRkcu9DRfE38ZoXvta8DPA5EgHMydoCdZVit.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/8633BBMk7vvanICwxYNOf9FtSXALq9h3m2wdPWHd.png",
    ];

    $targets = [
      'monster_images' => Monster::pluck('image_url')->toArray(),
      'item_images'    => Item::pluck('image_url')->toArray(),
      'weapon_images'  => Weapon::pluck('image_url')->toArray(),
    ];

    // keepUrls も S3キー形式に変換
    $keepPaths = array_map(function ($url) {
      if (filter_var($url, FILTER_VALIDATE_URL)) {
        return ltrim(parse_url($url, PHP_URL_PATH), '/');
      }
      return ltrim($url, '/');
    }, $keepUrls);

    foreach ($targets as $dir => $urls) {
      $this->info("S3上のファイル一覧を取得中... ディレクトリ: {$dir}");
      $allFiles = Storage::disk('s3')->allFiles($dir);

      $this->info("DB上の {$dir} の image_url を取得中...");

      // URLをS3キー形式に正規化
      $usedPaths = array_map(function ($url) {
        if (filter_var($url, FILTER_VALIDATE_URL)) {
          return ltrim(parse_url($url, PHP_URL_PATH), '/');
        }
        return ltrim($url, '/');
      }, array_filter($urls));

      // 削除対象（DB未使用 かつ keep対象でない）
      $unusedFiles = array_filter($allFiles, function ($file) use ($usedPaths, $keepPaths) {
        return !in_array($file, $usedPaths) && !in_array($file, $keepPaths);
      });

      if (empty($unusedFiles)) {
        $this->info("{$dir}: 削除対象の未使用ファイルはありません。");
        continue;
      }

      $this->warn("{$dir}: 未使用ファイルの削除を開始します...");

      foreach ($unusedFiles as $file) {
        Storage::disk('s3')->delete($file);
        $this->line("削除: {$file}");
      }

      $this->info("{$dir}: 未使用ファイルの削除が完了しました。");
    }

    return Command::SUCCESS;
  }
}
