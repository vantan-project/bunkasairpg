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
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/HUYO7eOJCxaGPKiLIig7N8J8PLAoSVkI786FlX7B.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/1QLlhaMsEg5QvA4MMsVZ9xTfZhIW2bsSYqqfeUfP.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/0x4rvV1ThaNbLWrUGjtnXwLcm2z3AZJgD8Y1poL5.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/f8LyXUdUvSSETdyEQuv9qyunf8LCLXsyxOmzO5j2.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/aAb2XVcPI04ov0MEzcGkHUKsSJReq2zEGSuzc5ml.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/RTQpZjZ3KkMDcWwZj9ZlB9WtWzhgf4oKpf9JLlRS.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/VZRYMKGx9FZsMJCGJGBz840XLVyT2Cir3AcmBMmh.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/HLzsjMIqEAawG5ovXAvnch9R9fxKSIuS5eQOiGxD.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/item_images/ZTDuJVytfQ79yvYJirg7DFVVFhw0uhNS5aVP9Px4.png",

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
      // START: kaito
      // ガンロボ
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/KDWUte1ZimktbnFibbvajindaAQs7p73LwKzpXcc.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/V1vpJiVgXxI95eqI99FqbhBFma8LpnEILQLcVmbc.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/cTOEhfCnbGI1r3kLfk07CgwiXaosD0JSBbE2l0UG.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/HICl0qAW4DooK3IY9tnvcOetB5JztPQkhDR0PzeE.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/lXZHkZDQTe4XfzQbJvPOaXEW57XQsIdvAn493Pgm.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/URfPxlQYkPxL3ybQ6PeHZqE3RCecIkChzzie1hKD.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/4Ytp1ziUx1DXpUfsHgCRNJUSFiXtQIeRqgSmXu7P.png",
      // カマキリ（モンスター）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/MGyrado4Ne3169RLT5H7nT65Zu2t2kUXiIqXBcvb.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/cIv6b38R6zOskqi3HCILDQ7GGveJF9WBctr23kVE.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/WGiKKoYHgsaorlDcRzctm6HIJEnlp3x4p7EBGvam.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/dCPyRafjd7RFMj8oaxmi6VY0VZ8kO4aVJeKxOZYm.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/LEeHWo23Q0469388p8hjYIuS1yeYZj3S5YHszC75.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/1vC713lXxeFhJ3kWDXx2iHroV4tnA5XsmPQL9OEQ.png",
      // カマキリ 双剣
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/uMrfTCtV7Hza5YKszMaEBPLLcQCujbnsrTmFEkTz.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/cCY3dCUcdTeE23EGwt9YBi7W2RynFnldGjN8KpdU.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/Iyx0p4hmSCpECEMycMZJQz7iOzjmQAZ0R1EHeyB7.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/Ag6VpCe8bhNPBjPLd6DG5rJccuSltFtwZV4OZerq.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/3KoqgXpIQhoKKStAi7UxBohADR6jq9UVBqvIvu1U.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/tFqe99NfV6VBJyZUdqJuHenVBlR84ZVBnUOm2NOh.png",
      // ロボット（武器）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/kKD5geOVbm1D2GgaEBplyaV00vSKOUD4T7kYjpLc.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/dW66bJNPvOnNF9pDxMuQYLa6u1hVgIlPnfRnnGDs.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/esDuRE6BI5CRDpsxOLTrSJ42JzoRg6njNCAp3XIM.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/OLGYtHYMAgc2S6lNeLirBkayfUMlE9zrVaA4RFaX.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/PNfa0nLpVcWzHGDalfRBDSiuExsxamimhJAMupmy.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/5wqVKXh48t3TduNQ8OSvj9aYJAjZpOTxc0t6liWz.png",

      // ドラゴンナイト（武器）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/xaNsSQZs5zW25r5Pvjjg9xSJM9zat77Y44zf6Q1P.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/PH035Sl4AFOwt2APK2LtsmFVrFbNqF2jHaOC2MYE.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/Ysw5S1GdeyQaEZjgSPChhk2f4hGaJc5i7X2lVt5o.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/ZBP9IDPWD3rBlrMZyKjub5nM1lqkV5yEksi6mcVc.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/1Ry1C4NCyNhWdwql8Gr8ytG3g9wcOYhnRwOb2y4l.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/6pnSPw6sZsAKITSRBBTluVrnbE2oa5Ah9LOG0EJS.png",

      // ドラゴン（武器）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/qdRdR7ZnRIO1lfrbZJSGeMLs2n5prVWMN93yKoN5.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/jJMBfITbTReWV8MPtAOsD3CYeucTbtj05iRv30lj.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/wxiykeIGEVrxaFf8PAY0FizXYFTH1X6t2gb3evWk.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/AqYQCAsNCPKCpvyhWVZxRLL650d3tsBbUsfMWu4Q.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/mIPLEP1Mv0CFZQdSz5ugCn0ojAUzfXzw3oOMCTYZ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/93yZuyXehJyb9pA50xiXT1jSYJcbNk6dgUReUSsp.png",

      // ドラゴンナイト（モンスター）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/jozTzH6btyE3sPlcnFFpF3jfMS5I20DoeXKQ79BU.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/LMxQOQjRS22PuGBMyhugsGV8Ir6UwhnnmXElhkOf.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/HzG1inwzr1NC8a4fWLBJNgNT5LYNjCfQHlrl5Qtz.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/KUdBguo8uq7SisxacNLjBMTEtwwNZYgw0phRbhJb.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/SJBhDDoTd3E2QfQiW6wIfCTPYQtkZ9MGfTPVeJRg.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/WeomH2CRgmJySPbZy2ujg8KfrjheQm40wHA45Utc.png",

      // ゴーレム（武器）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/UYLmQXWnkdKdMG5bkkLs7CuJvp2F6oaAne9MhrqC.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/fgGYRTce1LKOxBitXpUdnXzsPPRFDwnOhcLzKEf7.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/dkBZSmWPZLw923srMxnVBV9d7ughLG7h3kkA401g.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/r0cEXzXFGp3ZlQ07eKcJwZAROthy9VmcbLijuH4A.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/uGhJgkfYyffdxLTU9xk5o0l7vNREcUf4Z3CdzFZ7.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/xxziASeRfOFGfDBk3QL3eiUlgI6qYXZGNKBZt5Mw.png",

      // サイクロプス（武器）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/1PK54iPbkLuZAnAVa6Zc6MKcjBnXf9Cvm5VF8Hbe.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/Q90wAEAObaZPDcTzY95A3gsekjqoYGooNbbzdNc4.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/Z7y4mgiedPHwaoq4H4gplTxDFrWbdDivAUwW87PP.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/DDSLxZ4m70EfTDruVHPgiqyj8CMwSYXr0Rd3LrYB.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/IJhT1JlZ86R3pJlJIzAhIkf1Wn9uv0gscp3A9Xob.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/weapon_images/zx9pdw6yTXZPK7x722QSS406B7pRHUvlq3B1lqDj.png",

      // ドラゴン（モンスター）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/0qaKSzoPv85IRrWLiYcVydRogUktsis8ge7qzCsw.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/BR3Wazf7l408824A7Qf9klD6YholMxi59w2jd81K.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/uB4VC4D3FLWqambudYEfZ5vurv63IeaCVCkqJoOL.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/EfolQPLcUBbHse0bar6TfkuGIlzDm7mNlf2EgE1U.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/tUriwuZQ8PVgNqIQTEJgScDfCODaYpbpCRKs4RPy.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/eDo31eVAj4ga8lcx73UUuMx2JN1rfu40aTuDBjsh.png",

      // サイクロプス（モンスター）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/jjFBH0ewFD5Jq6mzxODImZVbeBwc6ru0qjhawhd0.jpg",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/NF2xYVBpiTxEOuR0ROFYZnVvI20wRK7kLCSxd1hu.jpg",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/1lXgD480v5fzpw6qJqqoRrOFUfnh0qNEvBgrRpiC.jpg",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/0CxSadcctWE0C9PKDbzpjEY1SU7KyOmMaDRSYDdW.jpg",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/Dd0WqOzO4RNcwXrhdxQMXz5rFaKzqipXtOkxHwDX.jpg",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/SW8Vj5TlinptyTLQqg4J63hM1UEmAfZXIr2ZuW73.jpg",

      // ゴーレム（モンスター）
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/gZyIDNtTzMhYPZudhj8Ls2BZK3ADLdkcfxSB1whJ.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/1cxHOTXZ98ra7DIn5bGw55V0QmRNhbwwHfME8ALa.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/VdaVdaAdwuW3NvNYoEMK6wrHMvMeSR3xKhZmMeTf.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/biMq2J8JY2drMLDsuoSWSbhTtbJKxF3ffoOjAApx.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/vAZLSOdzFZ2hRRJDsfwBi8YketjT96VcY6flNrod.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/L5cqWmLQUoV5a10mgMSH5MoHbBBZa6AXmyxzCidK.png",
      // END: kaito

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
      // クラーケン
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/hhCJYoiOyhOlkN2SgWEemQ6piuJP5hFlN8QNqbKd.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/TeY4MrGunXjdwim7bi5xw0uXEt8hSQNq6MfTf4e8.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/XGLK6ja9WZH7d0Yt6w7n7qCTID5wOMtt50HNJued.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/L6uwq50iM3ejPt1IPnbFYnzXwwWHHjRnrAdDnS2e.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/8rFoFkSUP3xoj8V2xVVXXlSRZ78whsEtyWiDMtnT.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/uic5vgGvDBQ61aygadzow2MMRma4EdXZpscEv3KO.png",
      // プラント
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/v4CRmXgQzdlEuBfmsaRLEyn6NjGcdQRoS2BSMuwO.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/PV2ddMDaLCIrX8CBubemWexuu4KBCm3ckt13f1JP.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/aChSzYIBhnYMuqz9vN63GeMbNf8G0hQQ9gwTtM2e.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/O9P1lAiyFCAhg5iFCfWlUYhxV4ERFhes6CwcrY98.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/RZWidVDZy7rSj6fFPn41NY2R3Y3aHet3aVTthXiZ.png",
      // オートマター
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/Qkqrrm6WhCj9pjhp1PuTWTgSglmTH7kqnCibhbC7.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/yi51maARvGAApkQIWtKJEr1Jd0XSTQjGxAdPnR6f.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/81osYyliza8gXg8oQD93q0UlZMCXnmlwD3M3l0fP.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/iTfTzGawX5u8S2gh6iWbqtCJa3heXR18CeuxzQAU.png",
      "https://s3-bunkasairpg.s3.ap-northeast-1.amazonaws.com/monster_images/P6bluU8tkCNyHjomWVU37Wp3RloxwbrQkicji33S.png",
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
