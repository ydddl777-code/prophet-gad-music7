import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// All uploaded cover art images
const ALL_IMAGES = [
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/26cbb5aa0_0a38bcbfca540d9170ee5def6d6fb1f4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f9137158e_0b3e8da0bc55c602aaff1d3b120cd781.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ec075b510_0b49fa64602bb2fb2eca407b06383e1b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6b93c3a9b_0da9478300a9f355e366fc377b9943a0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8d97c4a1d_0f1b35c8f9e3cc303ec97b58a49e4d66.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/18c3e862c_01ce6810f809df600bfa1896e9673a2a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7e3402afa_1a0596ed32232b40792df2f07468a65e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0fb8b4bba_1a9821466f62839451ef043674cb49b7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/73b82982c_1b30a3098bc342b7fd8efcaaa506c0de.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/57bf684d7_1b59026320dea11ca3109ab400cf1455.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/614b783db_1c0c99bdbb491f29a47f037cfc36ddab.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/88c1159f9_1d560e9e49c3c2cd2b012cdfcda1f7cb.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d39c731e5_1db068e32818254a9eee1498cd79f050.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f410ae8a9_1e17b22ed1a7535853a8f297216ae840.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/21c374c5b_2a2da3da57e34d0f9b9fb0e2a9692449.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4ff19b239_2b8b0600d2c2f35bcd357586a523e099.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/71d6a87c6_2e30182ffe529b2f274f3af1fa8179ae.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/fbfc8c536_2efa07116ea20e54fa2c6da33aa48f36.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4abd32d9b_2f1660ce061de8fa1f3d0d7d4a2189d0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c22bf33dd_2fef0d083b4a1c1d7b1387baca417af1.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b2c0abcbd_03a769f94136c4b37363e106b6164998.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/716c74d8d_3b0ca9355a195f9b201e2c02bcfed227.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7066cb38f_3b91e170a35a32d9f9eef6ff72eef791.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/73b68f4d9_3b1537316cd4346fff016bca02ca373c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/fb59c62a8_3c5c5b7b0823c88da4a6ceef49e4c968.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/41c096583_3cac2630fb072befc0b3a9f5ee93327a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/32933de2e_3ce974799359112432bb26b4efdaf459.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/11a26ed4f_3d48e5b3cff2102bdbd039593e911208.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c2bf165bc_3ddc70ee7431dfb953cbfc6b57b6a8ae.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e29e1781a_3e0b69d6b732c8cb92964e0f70368c1d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c0229861c_3ec313502f30611df5ec4d685167ba10.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/cbfdd8a58_3f62e8d54f5b0d1f1d92e4103e2c0f6d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ed87c3a99_04a2f5a4c7584403e8fcf86ab1d1c2d2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4c8f350e5_4a5b3693ba683632f76819984c5dd97f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2f7a41cc3_4a5d22270cc6c78bb20421423fd3e65c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8fe722470_4bcd079d3ff1844e4f09f998888ea269.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4ee4dd8e8_4c9d5aa4778739aa2bb4524f8f1cf45e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/819268010_4cb5ce056ea89ce85a3a8dd464649028.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/86fd702b1_4cb9b10e49074f3334eba982e2a2f649.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/1fadc25b1_4ce3f1588669a82bbf8eaa13f4201d94.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e838da813_4dd7107cb83614294722f821a6198193.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d728f16d1_4de9f226b3d516ce52519223525a7edc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9eea196c3_4f4942cb35745b1168165dc5da7d2cc4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/96c76292a_4fbcc7482474ece022d32b338e845c69.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/dd1c7e518_5c2569ddde5853aadb33abb850a7bb4b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/5e2232225_5de74391e445b876b13a2923324a9710.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c8d059363_5e3f306273194efa856473da19171366.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9b47e7226_5f959a2e0fb8618d31bbfb8edfa54aaa.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/94b57fdc8_06a5c72124c5bc31f7641d29e2477e9e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/06d96fe85_06cfe9724df9b96cb5dbdadf3cc98f20.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/97511e48e_6a5ace00c184557fcc562e343df99ed9.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9b08c88e0_6cb9732983973ce61c453f86c3f6125e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a039e2032_6d65a0bac627fd98cefe0906c0ea250d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/85288dc91_6fabe537d9aad8998e1c4b9085a01362.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2537e3626_7a0d48641080be439d08fce9f74bdc67.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8c3c5d3cf_7a9f2a46dffca70fe077d4543a19df1b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0fd3a3866_7c1fcbc0be44c59f4d11119d00d7b868.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e6a8a407a_7cef2a50e1933a741feee8b878f37051.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/79591baee_7d1d5dc566de3784e63b0b0e77f47160.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8f3dc376b_7e769d9389fdfe3c918fcf242673d6ba.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e42169851_7f5b460cbed61210594a5724f1fa9e1e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/dd399e022_008def4af5b2c2d5dc581787a39b12e5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d27588427_8cb9669a4c0de653422c91b8fc7cf66f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/49ceb2146_8d5c138b3967d1f8f0c0063a4731d898.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6c0fdfaef_8d22ca1ff353937725cd8ccba4f0d58f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a36f8a9a3_8f2304304b519d335c7695888972ac11.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7f25dd25a_8f3632112450580e31efab367abf81cb.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/19e5a861a_09d8550d850ec77724ef2a628a2cede5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f67106085_9a8c32a6eb63af88ca02957ee9d7e50d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9a66441ec_9cfab61dfb6083f1d597d9b32999c08a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/668f7f1fc_9d595e2448328b63137d56a60edd5cdf.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/904ce6596_9e99edbef129230185e8d1ffbe024fb3.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2c94d2bb8_10d16172af9987f4673716cd4fae61a7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3707bcef7_11c2ebf3944e16c6863bd1e1aecff96b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/fe57d5538_12d90e27faca050b8ec7f50a209b1c2f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9dc7ebb2c_14b6b3536c8fac5a2bd758c5bbba0ed2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/246f7c779_16f939cc00f73716441d095c43ea4564.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2d4a1b740_17e744603006579a888e62d5ac411699.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/615c8684b_18c10c43846f8897e2fb103ff638f4e5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9b5a60d10_18e1d117100319b49a1fd246ab5b58d0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/47775fe6a_19fb204ce84c7261732f7fbedd616618.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a0cfa4753_20ffc005ed804cf73e71de0b4b029a4e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/033b44e21_22af1cd63ca4dc53916b567a08ced878.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/32e5c1b5d_25d388bec1cfbe4be33d89f6b36f9ebb.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7f643671f_26ccbad9fb3d6a4be161565babefc362.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/436c6af37_32fc5e82a08b3c5ac1ac2bcca9b007ef.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/92b7781e0_35ecc430f7ba33e5125f55111dddf4f8.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2ac71e01b_38ee8e04e52514c390e772ccf73a8737.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/454e14a3a_40cdb946d69d7d51a02c4bc21f148be3.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/839b69b0a_40f80c9756b4ede2e840a33f148a8f78.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7f7f9e81d_43bd1f7fd19f5de4267dfad1a479cec5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/bf28c6f2c_44ce2406d950aa420ef44be641fd5275.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7cb15b36e_45c9a66561ab13a39acf830a2e7397e9.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9e7fa606f_47bc9fa13212e6db359a8c18d44d94c8.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7429ba3d2_47c4c6014e857b4ff84fdd3809980bb4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/afb6974d8_48fb8926d1472c15bdc95cb9133c77cc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f938ff2e5_50df43eb5345088feef8429b8ba5151b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/595b885f6_52f5d7519054a75f77b4578dc8c6c106.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0cf55faff_54a9343208dc6122fcfdd03743029071.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/888eac169_56a118be2c93db9c01c0e283d1b2f5cb.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ad760c667_58a7f2937f068d802a54cba96f7c603b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9e61ca601_58b724fa4a22ed7a79f7f22c250f7221.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d72eefbac_66b7471ad91c845271360c40bf98451e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8da1d657b_66cdb9831996a18c479416b233bb3a10.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b7ba336db_66d4eab2e20d061c778e328140e294dc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b7f256a45_67c05350caf9f505fb49960494b3b328.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6306817fb_71ba71c0f69e60268afc69641d219040.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/25a1ae54d_72abdc36254c0954cca25c74c9b54266.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2e3e8266f_74b1e2f3a7482f0cb27f4aea04b7ce3a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/df2b1c29b_74ed6bb62aa84d11a91f4ab896fa10ee.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b1b9b3a21_75e811be239aaf8699e07b4a8db457f5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6be4f26dc_77c6f13962ec01de6642666a3e9f3686.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4c1c4fa3f_79b7bed03d28900c5e0deec82fff640d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3e57a7f3e_85f67e30e0c21abc0113f3bb730f0cc7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ffe82c28c_86eebc648bb9aca7e42e6498193779c3.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e725d3764_87dea0f2bc1cd6b4193d6f7b1eff31a0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/489f4a04c_93b024ec9d345109bfff63e82b1eeda8.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/5413f8825_96b06e8a0463aa67dcd4adae49f6b458.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e4bce201a_98db37d8aa77d43ccd6e98ebef26a19e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/eb6b8fa77_108ac23b097eb31515b21ab711e443c7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/895e1ca37_110fc4a64803c3f34626214c59112325.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/57933c853_126bbbf40d4d0b6b23df06685a93bdcc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f68489872_175ae8f117fcbe7c11b217eee7dc0dc1.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/abb483ce8_195e1f4dc70c9bd3cc7325a25f042ff6.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f36d2c579_235caff74e62f846fdc15d93f8987a06.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8946f7da9_302edcff9de57d79a9ac4d786c5257c2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/5995f0c2e_367a47453b30a0689306beab31ca5352.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/892c19168_384e9179038c28c80afbab80fc56616e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2d54dbf58_399f583bf18f3bb4d7a14f127d48ae4f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/bb904214c_407baf7fef33ab9f158700555132de72.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/82ffd4bee_407f2e82e52821cc21a23c2fb48c961e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2c3b25826_430b22a1ca1732a70c8b9c8902a95a99.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/df23cba86_0465a4175b2fe7aba685050e368401e5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/dd5d14016_528a26b62e3ba86bc8453d9a0790af8c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/12a6d6ae3_536e72c883782c9ff75ca5c28b5325ef.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f147415ef_559abdca15b7b5273c2c3d5e1eec7696.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ae02e750a_573afc8290d0ab251a6a41b0e53b8a76.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6e3a888cb_594a91386cf485c3472d2dc0623db8d2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0753272b3_646f07958abf0f94b0cdd1c793fe248c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/570f916e3_665af0ff8c8dcd4b53a7662f3ca058ff.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a246a6f5f_0708e403207cf6898981868149da5eb6.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/79858dd12_720ed16a82e7b3cc53eb0b707e8eec2a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2c39e5e15_763a12470487d4ca69321022e11c227e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/5f0970281_769a3d43a256b277554c685ebce9a298.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/41e783328_799d4eae3758c62d338ea50b47fd3874.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ec73299a7_826affc5814a719c3a7b16ab149d5877.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e91c0dcb3_835e41237d6aeef89ebce63b8ee77c9f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2f6d04e97_852c7014c19207f645f11fbbb3d62164.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ba867577b_895d2c70efa25f4e6e399799f4bc1ad7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/bcbc4a416_963e1ef32aacdf8d52938001c02d5d1b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/94a2516bd_980e175a9a2ecffd691070d8c94e5264.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a84a7df62_990db4b366fc6c1bac718f806518def9.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/830abe86a_1061ebb40820e50d845db04a8061a3d0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a8a7d9a11_1490b0ffff2794b1c5a3cbd23b542d21.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8f69bc973_1975bac9f536965c280b3e6182dcbbe4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0667a6d0e_2171c63226d740ecc6b5f8fffe0065d2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/cdf189db3_3865b6719b9802aafd22afbf3468ac88.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9ed61c77c_4113cbdfcb2fc1cae53b91ac933989f5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/259b6603a_4135f1e0585985968140986da8edd666.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f813c6a36_4136c425569775384fa03874fc56a81e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a459628c1_4320f17b20133cf85fb0e201cf1190d0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4160b1d2b_4460b1ff0a6524575771b3435e22d171.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a95b53d31_4811a0a16e9503f2b1eb1bec3162a881.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/780ff2062_5021f13140f3bd9168dd282ff234d5fa.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4866cb64f_6347edaadef3ae575002a22d0d3c1382.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3480a6519_7620b8666f0047d165a50f19576e4ec7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3f3ef50af_07744b457711e9bc2928b156faf91dcc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2b219e1c2_8397d8f3789b0e414ee1d5e3ea077a23.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c0e4be15f_8647a0ea38a415d1fcaaabfd3bfbbd06.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4547469c2_8864e1ff98452d44046d44ac865c6936.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/dfc749865_9304cacc6bc8ea715ce6d17a90ff08e8.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/987b137ab_9500aca76d62214497a4a6a96981f205.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/97c115ab7_9863b04de3d847de789e2e5fc9e54f4e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b64534dc6_17968d30b2bf88320dc68f9ba5ab8a38.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/bc901c7d7_20518ab0e031e680cbf1ac6ee873e81a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d5ca2593f_27228fc293a3d8e5abd1f9420fff8f93.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/bae1bd337_32696a2c6868b482ac129242eea2fd44.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/745c0de32_65832ea9cfe78da9454aeac4321fe776.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d4c4c359e_69816b266c0d75c2d052a81995e9bab3.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/79c32a8aa_87521e19953904ffe0703e8fc2127ad5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/38a05555d_88482e6ab91486ce8759880f3456c432.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e944f999a_463908e589bcc3a807cbef7a09524d59.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e36bccfbc_545204abd279cd1c4d5478f558974064.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a553bebe3_561396d418cabd077d84f7d1e29aa609.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/88ccc00a5_730320ad202135b57188ae7e18adff18.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f1d24ed65_737727ba8677b2705633d3e70fedbbb3.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c02c0de4e_780460bf62339224dfca1d19c25445c4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3b7104e9e_899699efe8029cfbef7ecd980214a8b7.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9a5766064_2520128ccdc5c2562ba0ed3993b37153.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2c74859c1_2563225ed095e50b29810140df15ea72.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/14dee64e4_76785571db7ae927bf6f885ff8af0539.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9ad71fb46_180447234a0fb885dd9ac41aa1175e7a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/255489543_6087967813aed65311471a6bbd9fdbfe.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7b9942138_39475416046a39815c6778accd4cae7e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/fa8ffe2f8_a1fcef05309fc87316cf213c2291520c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/af342be47_a4df4acf0e2ba3ff60fbcac1f6103396.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/42a21148d_a8f51f98432ca4856fdb22c8a3515b20.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/023d8ff05_a9f45f8dcce4d2bbe4c2e27eaa54b2c6.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/08ebf626e_a21fccf548a86270fbbc145c8fd5a31f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6ec34f6b2_a68b508fb4c09b049d955619de98bb9b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f81d8f656_a73e4d1e6505522284389d7bda15bc3c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/5f39212ee_a612c9159248306ee2d95dc8d0e951f4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b07b3a5d9_a2990fc747e08f5d2ec3977c71bb02f5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/706b5bf22_a05439d35f0c7f16826aa2254bb1125d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/cf1c86cdc_aab10d6b31c22e90bd3f8c3e09b33994.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/765a33151_ab4aca773ce3fc5f49c0eb195b677e10.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/db53bd5dc_ab9e62cc139bd60b29fb3d2d61f253cf.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/81ca00df7_abc8217721550313c50eb5b0100dc29c.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6f1ad0d57_acc69ff7bb0d23c758e9ebf5acb95bd6.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7f81c9587_ad4d20e56bd8ebfd69b5c4e49fd50c60.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/cdda778a3_ae7f62ddf864732cd52541eb21ff0e4f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8569c8e25_b4ee812678fda709182764795f021a8b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/24403f5d7_b9b168fc0e9751ab88d99f729c9938ee.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/598a90133_b62e45f96e51c710fb717703221bb9bc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c502cde57_b63e3c8b1b9392a4c86b0f7412c4b129.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/55514ddd8_b89a166449d274dae14039cc34b7cd2f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/34ca5687f_b396f812688949bd5d1267551e3d28c9.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d69f57353_b566f0d0f68ad9c664e0f46d7ec790a3.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/82dd35116_b81822ba0b966947a06c1d30e0bd5db0.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/67d6ed45d_b1030388befb0b62670de69577afdc9a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6afeb5dcf_ba713ece3cf6cfd20053bc107a2009dd.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e6b016950_bc4c337b6029c525ad24c49484717f7b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f6f0a6d3d_bc5c810150be5c63f0cf0689f1550e5a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3b2cae586_bdab589072163a048b4b2053d9b29ad2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/030de720f_c3e90d751e7f844d748c46bea0dff1c5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ada87840b_c4ff35ae4a8e36eea38a1f1fca320c0f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e7ad9c350_c6f49c437d39bd02868816ccb5ad762a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/21adfea3a_c61fc627c0b93e571415d804fc444939.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/ccc36cee8_cb60f95993c9876adc2f5d354d3fe887.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d7fb2e506_cb4037af6a93201b2816a2b49fb3e3bf.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4ee89c3ce_ccb6cabc103c0fefed78f557407d77d8.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/05ad5fe29_cd5f77a8877ed4de97ece5e6309c8151.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a557f98ac_ce64dcd11b8e5a0b083b462c937d7e7a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0bc962e9f_cf9f522009fb45e97fd5b39b540d160a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/cbbc7812c_cf49e5fce651c0e6a629516a8a07713d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b17cf9adf_d4a7628786ce7ebf657e73c2bfe3fa1e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/7ea115ccc_d9adc0636cf977f15543c78ee645b55b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/645a4663a_d26b1a901611bb3d8b420c185b2454bf.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e7ea9f730_d53f67ae8b6b364ae73cdfb3fb6fd12d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3be00e1d0_d81ca42bb8e7d56ded7ee10b492341f4.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3bab55735_d206c84e9a1014532bd2e7788a11ceeb.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/be2897cde_d482c5e5f737740ef13ae2406dfd6a36.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/687dc1c6b_d763a96131cde08f387ccc69e6c77fee.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/fe3d432d7_dac472b988e85a885b1fc64970efaff9.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8ac00af31_db21813153e3e642206b1dc51f713125.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/bba85edd8_dce54c0afe8d38d3700c31e9c6c86439.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e6dd80810_dd902470519e7e157fc12ca843da67fc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/36b404c1a_de791cf0793062fb89b6204817b88e3b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/99ced355c_df00e7e64db9080f7dcfd2485ad23e56.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/679669d8a_df71d76c3e471afac421e2a170758274.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/096b0065f_df07394c08b87d4ba1621b79adb847dd.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8329b47d0_e0f4de402dec69c277dfd533ca0558bd.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/1358c6b84_e1a910ff2e38d9ac76536fed48008fee.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d1229eafc_e1aaab9cd09b944192443db0d7899a4f.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/3a8218f08_e4f8da79931f7de55214523170b18941.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a71d8a4d9_e6b851d76bf8093b8e75b6c0ee283b69.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2a954de4f_e55c669186b822a331f7da87bd8f9dfc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/6147880d1_e58ab1142731dc48098dad9bff2e2896.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/b2ce23a0a_e65b90a46c0a8554c3f787471f8f4e60.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/0daece0ff_e85f77ec26d2a64b4823fdd850dfc1b1.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d4a05d711_e587f1edfa6c88d0f139d45877688d41.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/280c0058e_e1492dd9be0914f195c836668c716360.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8819108f2_e3250f2a8e6b47c508719896f53c9edf.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d7f4ef16c_e19451d79d08abfa76ce68d59aafd7f2.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/336d64064_e23112a83950f5c2c67641f8ab6af33e.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/89fa46d8f_e7728042f803ebed869f8bbb20cc5d92.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e3ddbbd61_eb6d18dd36fa2403051a0fb840d83ab8.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/1a229d5ad_eb78ba23b2166904422569db480fb094.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/37f9b17a4_eba940ee751705482abafad82beeba3a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/e3274b77a_ed2983f7eea4bed400620b9cee83372a.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f3feed5f2_eeea365e52dac1bfe8130819bd072022.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/10a247c42_f0b327111e27290f17b91539ab20287d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/99eb1e9ed_f0d161f18b20383c3bbcb3cb0c4d3904.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/9b040d8c2_f1dd72b4749b0ded415b24f54fdc92bc.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/77814435e_f3ddbf43dda8ed56427e07011ac39d0b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c76af4860_f5f36df602bdbb6af7d6e9b7567b7e1d.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/beda7f5e9_f8fb98eef7d923e7af35e25d39d59842.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/a920e3147_f18ae90e1f62577e4756f0d88c810ece.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/2dc6184bf_f208e5dbb9560f65fd6c77c0e1a58a3b.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/01819d6ea_f5969a1524460d5d57a4c8a6c0cd5fa1.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/fe648620a_f80574b2b74ca82f237e294fad3bd2f5.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8634fda23_fe6c941fed8f0adf00044298e79c9581.jpg",
  // Previously named covers
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/306ae2317_BassandProphecy_cover.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c8323c178_MercysStone_cover.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/361a9e2c3_ProphetGadSpeaks_cover.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/60d60611a_ProphetGadsCall_cover.jpg",
  "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f106dcbcd_StreetlightsHoldUsTight_cover.jpg",
];

export default function CoverArtManager() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [trackSearch, setTrackSearch] = useState('');
  const [imageSearch, setImageSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: tracks = [] } = useQuery({
    queryKey: ['music-tracks-cover-mgr'],
    queryFn: () => base44.entities.MusicTrack.list('title', 500),
  });

  const filteredTracks = tracks.filter(t =>
    t.title?.toLowerCase().includes(trackSearch.toLowerCase())
  );

  const filteredImages = ALL_IMAGES.filter(url =>
    url.toLowerCase().includes(imageSearch.toLowerCase())
  );

  const assignCover = async (imageUrl) => {
    if (!selectedTrack) return;
    setSaving(true);
    await base44.entities.MusicTrack.update(selectedTrack.id, { cover_art_url: imageUrl });
    queryClient.invalidateQueries({ queryKey: ['music-tracks-cover-mgr'] });
    // Update local selected track
    setSelectedTrack(prev => ({ ...prev, cover_art_url: imageUrl }));
    setSavedMsg('Saved!');
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-400 mb-6">Cover Art Manager</h1>

        <div className="flex gap-4 h-[calc(100vh-120px)]">
          {/* LEFT: Track List */}
          <div className="w-72 shrink-0 bg-slate-900 rounded-xl flex flex-col overflow-hidden border border-slate-800">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search tracks..."
                  value={trackSearch}
                  onChange={e => setTrackSearch(e.target.value)}
                  className="pl-8 bg-slate-800 border-slate-700 text-white text-sm h-9"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredTracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className={`w-full flex items-center gap-2 p-2.5 text-left hover:bg-slate-800 transition-colors border-b border-slate-800/50 ${selectedTrack?.id === track.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : ''}`}
                >
                  {track.cover_art_url ? (
                    <img src={track.cover_art_url} alt="" className="w-10 h-10 rounded object-cover shrink-0" onError={e => e.target.style.display='none'} />
                  ) : (
                    <div className="w-10 h-10 rounded bg-slate-700 shrink-0 flex items-center justify-center text-slate-500 text-xs">?</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate text-white">{track.title}</p>
                    <p className="text-xs text-slate-400 truncate">{track.artist || 'Unknown'}</p>
                  </div>
                  {track.cover_art_url && <Check className="w-3 h-3 text-green-400 shrink-0 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Image Grid + Selected Track Header */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Selected track header */}
            {selectedTrack ? (
              <div className="bg-slate-900 rounded-xl p-3 mb-3 border border-amber-500/30 flex items-center gap-3">
                {selectedTrack.cover_art_url && (
                  <img src={selectedTrack.cover_art_url} alt="" className="w-14 h-14 rounded object-cover" onError={e => e.target.style.display='none'} />
                )}
                <div>
                  <p className="font-bold text-amber-400">{selectedTrack.title}</p>
                  <p className="text-slate-400 text-sm">Click any image below to assign as cover art</p>
                </div>
                {savedMsg && <span className="ml-auto text-green-400 font-bold text-sm">{savedMsg}</span>}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl p-3 mb-3 border border-slate-800 text-slate-400 text-sm text-center">
                ← Select a track from the list to assign cover art
              </div>
            )}

            {/* Image search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Filter images..."
                value={imageSearch}
                onChange={e => setImageSearch(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-700 text-white"
              />
            </div>

            {/* Image grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {filteredImages.map((url, i) => {
                  const isCurrent = selectedTrack?.cover_art_url === url;
                  return (
                    <button
                      key={i}
                      onClick={() => assignCover(url)}
                      disabled={!selectedTrack || saving}
                      className={`relative aspect-square rounded-lg overflow-hidden group border-2 transition-all ${
                        isCurrent ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-transparent hover:border-amber-500/50'
                      } ${!selectedTrack ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-amber-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}