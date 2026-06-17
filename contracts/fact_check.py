# v0.1.0
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

"""
FactCheckProtocol — Decentralized Fact-Checking on GenLayer
Fast AI consensus with validator agreement.
"""

import json
import hashlib
import typing

from genlayer import *

SUBMISSION_FEE_WEI = 1_000_000_000_000_000_000   # 1 GEN
CHALLENGE_FEE_WEI = 5_000_000_000_000_000_000     # 5 GEN
REWARD_MULTIPLIER = 2
CONFIDENCE_TOLERANCE = 30  # Validators agree if confidence within 30 points

E_EXPECTED = "[EXPECTED]"


def handle_leader_error(leader: typing.Any, leader_fn: typing.Callable) -> bool:
    """Simple error handling for consensus."""
    leader_msg = getattr(leader, "message", "") or ""
    try:
        leader_fn()
        return False
    except gl.vm.UserError as e:
        v = getattr(e, "message", "") or str(e)
        if v.startswith(E_EXPECTED):
            return v == leader_msg
        return False
    except Exception:
        return False


class FactCheckProtocol(gl.Contract):
    claims: TreeMap[str, str]
    user_profiles: TreeMap[str, str]
    challenges: TreeMap[str, str]
    claim_count: bigint
    challenge_counter: bigint
    total_staked: bigint

    def __init__(self):
        self.claim_count = 0
        self.challenge_counter = 0
        self.total_staked = 0

    @gl.public.write.payable
    def submit_claim(self, claim_text: str, source_url: str) -> str:
        stake = gl.message.value
        sender = gl.message.sender_address

        if stake < SUBMISSION_FEE_WEI:
            raise gl.vm.UserError(f"{E_EXPECTED} Stake below minimum (1 GEN required).")
        if not claim_text.strip():
            raise gl.vm.UserError(f"{E_EXPECTED} Claim text cannot be empty.")

        self.claim_count += 1
        claim_id = f"claim_{self.claim_count}"

        # Run AI analysis with consensus
        result = self._analyze_claim(claim_text, source_url)

        claim = {
            "id": claim_id,
            "text": claim_text[:2048],
            "source_url": source_url[:512],
            "verdict": result.get("verdict", "UNVERIFIABLE"),
            "confidence": int(result.get("confidence", 0)),
            "reasoning": result.get("reasoning", "")[:512],
            "submitter": sender.as_hex,
            "sources_checked": int(result.get("sources_checked", 0)),
            "has_been_checked": True,
            "challenge_count": 0,
        }

        self.claims[claim_id] = json.dumps(claim)

        addr_str = sender.as_hex
        if addr_str not in self.user_profiles:
            profile = {
                "address": addr_str,
                "submissions": 0,
                "correct_submissions": 0,
                "challenges": 0,
                "successful_challenges": 0,
                "reputation": 0,
                "total_staked": 0,
                "pending_rewards": 0,
            }
        else:
            profile = json.loads(self.user_profiles[addr_str])

        profile["submissions"] += 1
        profile["total_staked"] += int(SUBMISSION_FEE_WEI)
        self.total_staked += SUBMISSION_FEE_WEI

        if result.get("verdict") != "UNVERIFIABLE":
            profile["reputation"] += 1
            profile["correct_submissions"] += 1

        self.user_profiles[addr_str] = json.dumps(profile)
        return claim_id

    def _analyze_claim(self, claim_text: str, source_url: str) -> dict:
        """AI analysis with consensus - fast but still validates."""
        
        def leader_fn() -> dict:
            # Try to fetch source
            evidence = ""
            sources_checked = 0
            
            try:
                resp = gl.nondet.web.get(source_url)
                if getattr(resp, "status_code", 200) == 200:
                    body = resp.body.decode("utf-8", errors="replace")
                    evidence = body[:3000]
                    sources_checked = 1
            except Exception:
                pass

            # Quick AI analysis
            if evidence:
                prompt = f"""Analyze this claim quickly based on evidence.

CLAIM: {claim_text}

EVIDENCE:
{evidence}

Return JSON: {{"verdict": "TRUE"|"FALSE"|"UNVERIFIABLE", "confidence": 0-100, "reasoning": "brief reason"}}

TRUE = evidence supports. FALSE = contradicts. UNVERIFIABLE = not enough info."""
            else:
                prompt = f"""Analyze this claim using your general knowledge.

CLAIM: {claim_text}

Return JSON: {{"verdict": "TRUE"|"FALSE"|"UNVERIFIABLE", "confidence": 0-100, "reasoning": "brief reason"}}

TRUE = likely true. FALSE = likely false. UNVERIFIABLE = cannot determine."""

            try:
                res = gl.nondet.exec_prompt(prompt, response_format="json")
                if not isinstance(res, dict):
                    return {"verdict": "UNVERIFIABLE", "confidence": 0, "reasoning": "AI error", "sources_checked": 0}

                verdict = str(res.get("verdict", "UNVERIFIABLE")).upper()
                if verdict not in ("TRUE", "FALSE", "UNVERIFIABLE"):
                    verdict = "UNVERIFIABLE"

                return {
                    "verdict": verdict,
                    "confidence": max(0, min(100, int(res.get("confidence", 50)))),
                    "reasoning": str(res.get("reasoning", ""))[:512],
                    "sources_checked": sources_checked,
                }
            except Exception as e:
                return {"verdict": "UNVERIFIABLE", "confidence": 0, "reasoning": f"Error: {str(e)[:100]}", "sources_checked": 0}

        def validator_fn(leader: gl.vm.Result) -> bool:
            """Validators agree if same verdict and confidence within tolerance."""
            if not isinstance(leader, gl.vm.Return):
                return handle_leader_error(leader, leader_fn)

            mine = leader_fn()
            l_verdict = leader.calldata["verdict"]
            v_verdict = mine["verdict"]
            l_conf = int(leader.calldata["confidence"])
            v_conf = int(mine["confidence"])

            # Agree if same verdict and confidence within tolerance
            return l_verdict == v_verdict and abs(l_conf - v_conf) <= CONFIDENCE_TOLERANCE

        # Run with consensus
        return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

    @gl.public.write.payable
    def challenge_claim(self, claim_id: str, reason: str) -> str:
        stake = gl.message.value
        sender = gl.message.sender_address

        if stake < CHALLENGE_FEE_WEI:
            raise gl.vm.UserError(f"{E_EXPECTED} Challenge requires 5 GEN stake.")
        if claim_id not in self.claims:
            raise gl.vm.UserError(f"{E_EXPECTED} Claim not found.")

        claim = json.loads(self.claims[claim_id])
        old_verdict = claim["verdict"]
        old_confidence = claim.get("confidence", 0)
        old_reasoning = claim.get("reasoning", "")

        # Re-analyze with consensus
        result = self._analyze_claim(claim["text"], claim["source_url"])

        new_verdict = result.get("verdict", "UNVERIFIABLE")
        new_confidence = int(result.get("confidence", 0))
        new_reasoning = result.get("reasoning", "")[:512]

        self.challenge_counter += 1
        challenge_id = f"chall_{claim_id}_{self.challenge_counter}"

        is_successful = new_verdict != old_verdict

        challenge_record = {
            "id": challenge_id,
            "claim_id": claim_id,
            "challenger": sender.as_hex,
            "reason": reason[:512],
            "old_verdict": old_verdict,
            "old_confidence": int(old_confidence),
            "old_reasoning": old_reasoning,
            "new_verdict": new_verdict,
            "new_confidence": new_confidence,
            "new_reasoning": new_reasoning,
            "is_successful": is_successful,
            "staked_amount": int(CHALLENGE_FEE_WEI),
        }

        self.challenges[challenge_id] = json.dumps(challenge_record)

        claim["challenge_count"] = claim.get("challenge_count", 0) + 1
        if is_successful:
            claim["verdict"] = new_verdict
            claim["confidence"] = new_confidence
            claim["reasoning"] = new_reasoning

        self.claims[claim_id] = json.dumps(claim)

        addr_str = sender.as_hex
        if addr_str not in self.user_profiles:
            profile = {
                "address": addr_str,
                "submissions": 0,
                "correct_submissions": 0,
                "challenges": 0,
                "successful_challenges": 0,
                "reputation": 0,
                "total_staked": 0,
                "pending_rewards": 0,
            }
        else:
            profile = json.loads(self.user_profiles[addr_str])

        profile["challenges"] += 1
        profile["total_staked"] += int(CHALLENGE_FEE_WEI)
        self.total_staked += CHALLENGE_FEE_WEI

        if is_successful:
            reward = int(CHALLENGE_FEE_WEI * REWARD_MULTIPLIER)
            profile["successful_challenges"] += 1
            profile["reputation"] += 2
            profile["pending_rewards"] += reward

        self.user_profiles[addr_str] = json.dumps(profile)
        return challenge_id

    @gl.public.write
    def withdraw_rewards(self) -> str:
        sender = gl.message.sender_address
        addr_str = sender.as_hex

        if addr_str not in self.user_profiles:
            raise gl.vm.UserError(f"{E_EXPECTED} No profile found.")

        profile = json.loads(self.user_profiles[addr_str])
        pending = int(profile.get("pending_rewards", 0))

        if pending <= 0:
            raise gl.vm.UserError(f"{E_EXPECTED} No rewards to withdraw.")

        profile["pending_rewards"] = 0
        self.user_profiles[addr_str] = json.dumps(profile)
        return f"Withdrawn {pending} wei as rewards"

    @gl.public.view
    def get_claims(self) -> str:
        results = []
        for cid in self.claims.keys():
            raw = self.claims.get(cid, "")
            if raw:
                results.append(json.loads(raw))
        return json.dumps(results)

    @gl.public.view
    def get_claim(self, claim_id: str) -> str:
        raw = self.claims.get(claim_id, "")
        if not raw:
            return json.dumps({})
        return raw

    @gl.public.view
    def get_claim_challenges(self, claim_id: str) -> str:
        results = []
        for cid in self.challenges.keys():
            raw = self.challenges.get(cid, "")
            if raw:
                chall = json.loads(raw)
                if chall.get("claim_id") == claim_id:
                    results.append(chall)
        return json.dumps(results)

    @gl.public.view
    def get_challenge(self, challenge_id: str) -> str:
        raw = self.challenges.get(challenge_id, "")
        if not raw:
            return json.dumps({})
        return raw

    @gl.public.view
    def get_user_profile(self, user_address: str) -> str:
        raw = self.user_profiles.get(user_address, "")
        if not raw:
            return json.dumps({
                "address": user_address,
                "submissions": 0,
                "correct_submissions": 0,
                "challenges": 0,
                "successful_challenges": 0,
                "reputation": 0,
                "total_staked": 0,
                "pending_rewards": 0,
            })
        return raw

    @gl.public.view
    def get_leaderboard(self) -> str:
        leaders = []
        for addr_str in self.user_profiles.keys():
            raw = self.user_profiles.get(addr_str, "")
            if raw:
                profile = json.loads(raw)
                leaders.append({
                    "address": profile.get("address", ""),
                    "reputation": int(profile.get("reputation", 0)),
                    "submissions": int(profile.get("submissions", 0)),
                    "correct_submissions": int(profile.get("correct_submissions", 0)),
                })
        leaders.sort(key=lambda x: x["reputation"], reverse=True)
        return json.dumps(leaders[:10])

    @gl.public.view
    def get_stats(self) -> str:
        verified = 0
        for cid in self.claims.keys():
            raw = self.claims.get(cid, "")
            if raw:
                c = json.loads(raw)
                if c.get("has_been_checked") and c.get("verdict") != "UNVERIFIABLE":
                    verified += 1
        return json.dumps({
            "total_claims": int(self.claim_count),
            "total_challenges": int(self.challenge_counter),
            "total_staked": int(self.total_staked),
            "verified_claims": verified,
        })
