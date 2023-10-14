'use client';

import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
  InstapaperShareButton,
} from 'react-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPinterestP } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const iconClasses = 'text-primary-500 w-4 h-4';

type Props = {
  thoughtId: string;
  thought: string;
  thoughtImage: string;
};

export default function SharePopover({
  thoughtId,
  thought,
  thoughtImage,
}: Props) {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            className={`group focus:outline-none focus:ring-none`}
          >
            <Image
              src='/assets/share.svg'
              height={24}
              width={24}
              alt='icon-share'
              className='cursor-pointer object-contain'
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='absolute left-3/5 z-10 mt-2 border border-dark-4 rounded-md bg-dark-2 -translate-x-1/2 transform px-2 sm:px-0'>
              {/* to be updated with the actual app link */}
              <section className='flex flex-row gap-4 py-2 px-5'>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(thought);
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} className={iconClasses} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${APP_URL}/${JSON.parse(thoughtId)}`
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faLink} className={iconClasses} />
                </button>
                <EmailShareButton url={`${APP_URL}/${JSON.parse(thoughtId)}`}>
                  <FontAwesomeIcon icon={faEnvelope} className={iconClasses} />
                </EmailShareButton>
                <TwitterShareButton url={`${APP_URL}/${JSON.parse(thoughtId)}`}>
                  <FontAwesomeIcon icon={faTwitter} className={iconClasses} />
                </TwitterShareButton>
                <FacebookShareButton
                  url={`${APP_URL}/${JSON.parse(thoughtId)}`}
                >
                  <FontAwesomeIcon icon={faFacebookF} className={iconClasses} />
                </FacebookShareButton>
                <InstapaperShareButton
                  url={`${APP_URL}/${JSON.parse(thoughtId)}`}
                >
                  <FontAwesomeIcon icon={faInstagram} className={iconClasses} />
                </InstapaperShareButton>
                <PinterestShareButton
                  url={`${APP_URL}/${JSON.parse(thoughtId)}`}
                  media={thoughtImage}
                >
                  <FontAwesomeIcon
                    icon={faPinterestP}
                    className={iconClasses}
                  />
                </PinterestShareButton>
              </section>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
